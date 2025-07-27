import React, { useState } from 'react';
import { MapPin, Camera, Star, Tag, Type, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const PLACE_TYPES = [
  'Restaurant',
  'Café',
  'Bar',
  'Club',
  'Cinéma',
  'Musée',
  'Parc',
  'Shopping',
  'Hôtel',
  'Autre'
];

interface AddPlaceFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export const AddPlaceForm: React.FC<AddPlaceFormProps> = ({
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    description: '',
    rating: 0,
    tags: '',
    image: ''
  });

  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    onSubmit?.({
      ...formData,
      tags: tagsArray,
      id: Date.now().toString(),
      author: 'Vous',
      likes: 0,
      comments: 0,
      isLiked: false
    });
  };

  const handleStarClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isActive = starValue <= (hoveredStar || formData.rating);
      
      return (
        <Star
          key={i}
          className={`w-6 h-6 cursor-pointer transition-all duration-200 ${
            isActive ? 'text-rating-gold' : 'text-muted-foreground/40'
          } hover:scale-110`}
          fill={isActive ? 'currentColor' : 'none'}
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => setHoveredStar(starValue)}
          onMouseLeave={() => setHoveredStar(0)}
        />
      );
    });
  };

  return (
    <Card className="card-instagram animate-scale-in max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-instagram bg-clip-text text-transparent">
          ✨ Partager un lieu incroyable
        </CardTitle>
        <p className="text-muted-foreground">
          Faites découvrir vos endroits favoris à la communauté
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom du lieu */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 font-semibold">
              <Type className="w-4 h-4" />
              Nom du lieu
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Café des Arts"
              className="input-modern"
              required
            />
          </div>

          {/* Type et localisation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="flex items-center gap-2 font-semibold">
                <Tag className="w-4 h-4" />
                Type de lieu
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                required
              >
                <SelectTrigger className="input-modern">
                  <SelectValue placeholder="Choisir un type" />
                </SelectTrigger>
                <SelectContent>
                  {PLACE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2 font-semibold">
                <MapPin className="w-4 h-4" />
                Localisation
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Ex: Paris, Montmartre"
                className="input-modern"
                required
              />
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-semibold">
              <Star className="w-4 h-4" />
              Votre note
            </Label>
            <div className="flex items-center gap-1">
              {renderStars()}
              <span className="ml-2 text-sm text-muted-foreground">
                {formData.rating > 0 ? `${formData.rating}/5` : 'Cliquez pour noter'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2 font-semibold">
              <MessageSquare className="w-4 h-4" />
              Votre avis
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Partagez votre expérience, l'ambiance, les points forts..."
              className="input-modern resize-none h-24"
              required
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="flex items-center gap-2 font-semibold">
              <Tag className="w-4 h-4" />
              Tags (optionnel)
            </Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="Ex: cosy, terrasse, végétarien (séparez par des virgules)"
              className="input-modern"
            />
          </div>

          {/* URL d'image */}
          <div className="space-y-2">
            <Label htmlFor="image" className="flex items-center gap-2 font-semibold">
              <Camera className="w-4 h-4" />
              Photo (URL)
            </Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              placeholder="https://exemple.com/photo.jpg"
              className="input-modern"
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="btn-instagram flex-1"
              disabled={!formData.name || !formData.type || !formData.location || !formData.description || formData.rating === 0}
            >
              ✨ Partager ce lieu
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-6"
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};