import React from 'react';
import { MapPin, Star, Heart, MessageCircle, Flag } from 'lucide-react';
import { Button } from './ui/button';

export interface Place {
  id: string;
  name: string;
  type: string;
  location: string;
  rating: number;
  description: string;
  image: string;
  author: string;
  likes: number;
  comments: number;
  tags: string[];
  isLiked?: boolean;
}

interface PlaceCardProps {
  place: Place;
  onLike?: (id: string) => void;
  onComment?: (id: string) => void;
  onReport?: (id: string) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  onLike,
  onComment,
  onReport
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'rating-star filled' : 'rating-star empty'
        }`}
        fill={i < rating ? 'currentColor' : 'none'}
      />
    ));
  };

  return (
    <div className="card-instagram animate-fade-in-up group">
      {/* Image du lieu */}
      <div className="relative overflow-hidden">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Bouton signaler en haut à droite */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 text-white bg-black/20 backdrop-blur-sm hover:bg-black/30"
          onClick={() => onReport?.(place.id)}
        >
          <Flag className="w-4 h-4" />
        </Button>

        {/* Type de lieu en overlay */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
            {place.type}
          </span>
        </div>
      </div>

      {/* Contenu de la carte */}
      <div className="p-6">
        {/* Header avec nom et rating */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
              {place.name}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{place.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 ml-4">
            {renderStars(place.rating)}
            <span className="text-sm font-medium ml-1">{place.rating}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {place.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {place.tags.map((tag, index) => (
            <span key={index} className="tag-modern">
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer avec auteur et actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="text-sm text-muted-foreground">
            Par <span className="font-medium text-foreground">{place.author}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 ${
                place.isLiked ? 'text-red-500' : 'text-muted-foreground'
              } hover:text-red-500 transition-colors`}
              onClick={() => onLike?.(place.id)}
            >
              <Heart
                className="w-4 h-4"
                fill={place.isLiked ? 'currentColor' : 'none'}
              />
              <span className="text-sm">{place.likes}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-muted-foreground hover:text-accent transition-colors"
              onClick={() => onComment?.(place.id)}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{place.comments}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};