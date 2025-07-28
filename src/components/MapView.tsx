import React from 'react';
import { Place } from './PlaceCard';
import { InteractiveMap } from './InteractiveMap';

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
  return (
    <div className={`h-96 ${className}`}>
      <InteractiveMap
        places={places}
        center={[48.8566, 2.3522]}
        zoom={13}
        className="h-full w-full"
      />
    </div>
  );
};