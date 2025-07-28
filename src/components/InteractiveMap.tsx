import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Place } from './PlaceCard';

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  places?: Place[];
  center?: [number, number];
  zoom?: number;
  onLocationSelect?: (lat: number, lng: number, address?: string) => void;
  selectedLocation?: [number, number] | null;
  showLocationSelector?: boolean;
  className?: string;
}

const LocationSelector: React.FC<{ onLocationSelect?: (lat: number, lng: number) => void }> = ({
  onLocationSelect
}) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect?.(lat, lng);
    },
  });
  
  return null;
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  places = [],
  center = [48.8566, 2.3522], // Paris par défaut
  zoom = 13,
  onLocationSelect,
  selectedLocation,
  showLocationSelector = false,
  className = ""
}) => {
  const mapRef = useRef<L.Map>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const handleLocateUser = () => {
    setIsLocating(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const location: [number, number] = [lat, lng];
          
          setUserLocation(location);
          onLocationSelect?.(lat, lng);
          
          // Centrer la carte sur la position de l'utilisateur
          if (mapRef.current) {
            mapRef.current.setView(location, 16);
          }
          
          setIsLocating(false);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      console.error('Géolocalisation non supportée');
      setIsLocating(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full rounded-lg"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Sélecteur de localisation pour le formulaire */}
        {showLocationSelector && <LocationSelector onLocationSelect={onLocationSelect} />}
        
        {/* Marqueur de la position sélectionnée */}
        {selectedLocation && (
          <Marker position={selectedLocation}>
            <Popup>
              <div className="text-center">
                <MapPin className="w-4 h-4 mx-auto mb-1 text-primary" />
                <p className="text-sm font-medium">Lieu sélectionné</p>
                <p className="text-xs text-muted-foreground">
                  {selectedLocation[0].toFixed(4)}, {selectedLocation[1].toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Marqueur de la position de l'utilisateur */}
        {userLocation && (
          <Marker 
            position={userLocation}
            icon={L.divIcon({
              className: 'user-location-marker',
              html: `<div style="
                width: 20px; 
                height: 20px; 
                background: #3b82f6; 
                border: 3px solid white; 
                border-radius: 50%; 
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
              "></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
          >
            <Popup>
              <div className="text-center">
                <div className="w-4 h-4 mx-auto mb-1 bg-blue-500 rounded-full"></div>
                <p className="text-sm font-medium">Votre position</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Marqueurs des lieux existants */}
        {places.map((place) => (
          <Marker 
            key={place.id} 
            position={[
              48.8566 + (Math.random() - 0.5) * 0.1, // Position simulée autour de Paris
              2.3522 + (Math.random() - 0.5) * 0.1
            ]}
          >
            <Popup>
              <div className="text-center">
                <img 
                  src={place.image} 
                  alt={place.name}
                  className="w-32 h-20 object-cover rounded mb-2"
                />
                <h3 className="font-semibold text-sm">{place.name}</h3>
                <p className="text-xs text-muted-foreground">{place.type}</p>
                <p className="text-xs">⭐ {place.rating}/5</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Bouton de géolocalisation */}
      {showLocationSelector && (
        <Button
          onClick={handleLocateUser}
          disabled={isLocating}
          className="absolute top-4 right-4 z-[1000] bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-md"
          size="sm"
        >
          <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
          {isLocating ? 'Localisation...' : 'Me localiser'}
        </Button>
      )}
    </div>
  );
};