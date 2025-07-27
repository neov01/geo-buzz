import React from 'react';
import { MapPin, Navigation, Zap } from 'lucide-react';
import { Place } from './PlaceCard';

interface MapViewProps {
  places: Place[];
  onPlaceSelect?: (place: Place) => void;
  className?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  places,
  onPlaceSelect,
  className = ""
}) => {
  // Simulation d'une carte interactive (en attendant l'intégration Google Maps/Leaflet)
  const mockLocations = [
    { x: 25, y: 30 },
    { x: 65, y: 45 },
    { x: 40, y: 70 },
    { x: 75, y: 25 },
    { x: 30, y: 85 },
    { x: 80, y: 60 },
    { x: 15, y: 55 },
    { x: 90, y: 40 }
  ];

  return (
    <div className={`map-container relative ${className}`}>
      {/* Carte factice avec gradient moderne */}
      <div className="relative h-96 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        {/* Grille de fond subtile */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        {/* Simulation des routes */}
        <svg className="absolute inset-0 w-full h-full">
          <path
            d="M0 100 Q200 50 400 150 T800 100"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />
          <path
            d="M100 0 Q150 200 300 150 T500 350"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />
        </svg>

        {/* Marqueurs des lieux */}
        {places.slice(0, 8).map((place, index) => {
          const location = mockLocations[index] || { x: 50, y: 50 };
          
          return (
            <div
              key={place.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group animate-scale-in"
              style={{
                left: `${location.x}%`,
                top: `${location.y}%`,
                animationDelay: `${index * 0.1}s`
              }}
              onClick={() => onPlaceSelect?.(place)}
            >
              {/* Pulse animation */}
              <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping group-hover:animate-none" />
              
              {/* Marqueur principal */}
              <div className="relative bg-primary text-white p-2 rounded-full shadow-lg group-hover:scale-125 transition-transform duration-300">
                <MapPin className="w-5 h-5" />
              </div>

              {/* Tooltip au survol */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap backdrop-blur-sm">
                  <div className="font-semibold">{place.name}</div>
                  <div className="text-xs opacity-80">{place.type} • ⭐ {place.rating}</div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
                </div>
              </div>
            </div>
          );
        })}

        {/* Bouton géolocalisation */}
        <div className="absolute top-4 right-4">
          <button className="bg-card text-foreground p-3 rounded-full shadow-medium hover:shadow-strong transition-all duration-300 hover:scale-105 border border-border/20">
            <Navigation className="w-5 h-5" />
          </button>
        </div>

        {/* Indicateur de zoom */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button className="bg-card text-foreground px-3 py-2 rounded-lg shadow-medium hover:shadow-strong transition-all duration-300 hover:scale-105 border border-border/20 font-semibold">
            +
          </button>
          <button className="bg-card text-foreground px-3 py-2 rounded-lg shadow-medium hover:shadow-strong transition-all duration-300 hover:scale-105 border border-border/20 font-semibold">
            -
          </button>
        </div>

        {/* Légende */}
        <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm p-3 rounded-xl shadow-medium border border-border/20">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-muted-foreground">Lieux partagés</span>
            </div>
            <div className="flex items-center gap-1 ml-3">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span className="text-muted-foreground text-xs">{places.length} lieux</span>
            </div>
          </div>
        </div>

        {/* Message d'aide si aucun lieu */}
        {places.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                Aucun lieu partagé
              </h3>
              <p className="text-muted-foreground text-sm">
                Soyez le premier à partager un lieu incroyable !
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};