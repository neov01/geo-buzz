import React, { useState } from 'react';
import { MapPin, Star, Tag, Type, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { InteractiveMap } from './InteractiveMap';
import { PhotoUpload } from './PhotoUpload';

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
    image: '',
    latitude: 0,
    longitude: 0
  });

  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des champs requis
    if (!formData.name.trim()) {
      alert('Le nom du lieu est requis');
      return;
    }
    
    if (!formData.type) {
      alert('Le type de lieu est requis');
      return;
    }
    
    if (!formData.location.trim()) {
      alert('L\'adresse est requise. Veuillez sélectionner un lieu sur la carte.');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('La description est requise');
      return;
    }
    
    if (formData.rating === 0) {
      alert('Veuillez attribuer une note au lieu');
      return;
    }
    
    if (!selectedLocation) {
      alert('Veuillez sélectionner un lieu sur la carte');
      return;
    }
    
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    
    const placeData = {
      name: formData.name.trim(),
      type: formData.type,
      location: formData.location.trim(),
      description: formData.description.trim(),
      rating: formData.rating,
      tags: tagsArray,
      image: formData.image || '/placeholder.svg'
    };
    
    console.log('Données du lieu à ajouter:', placeData);
    onSubmit?.(placeData);
  };

  const handleLocationSelect = async (lat: number, lng: number) => {
    setSelectedLocation([lat, lng]);
    setFormData(prev => ({ 
      ...prev, 
      latitude: lat, 
      longitude: lng 
    }));

    // Géocodage inverse pour obtenir l'adresse
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setFormData(prev => ({ 
          ...prev, 
          location: data.display_name 
        }));
      }
    } catch (error) {
      console.error('Erreur géocodage:', error);
    }
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

          {/* Carte interactive */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-semibold">
              <MapPin className="w-4 h-4" />
              Localisation sur la carte
            </Label>
            <div className="h-64 border rounded-lg overflow-hidden">
              <InteractiveMap
                center={[48.8566, 2.3522]}
                zoom={13}
                onLocationSelect={handleLocationSelect}
                selectedLocation={selectedLocation}
                showLocationSelector={true}
                className="h-full"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Cliquez sur la carte pour sélectionner l'emplacement exact ou utilisez le bouton "Me localiser"
            </p>
          </div>

          {/* Upload de photo */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-semibold">
              <Type className="w-4 h-4" />
              Photo du lieu
            </Label>
            <PhotoUpload
              onPhotoUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
              onPhotoRemoved={() => setFormData(prev => ({ ...prev, image: '' }))}
              currentPhoto={formData.image}
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="btn-instagram flex-1"
              disabled={!formData.name || !formData.type || !formData.location || !formData.description || formData.rating === 0 || !selectedLocation}
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