import React, { useState, useMemo } from 'react';
import { Filter, Grid, Map, Sparkles } from 'lucide-react';
import { Header } from '../components/Header';
import { PlaceCard, Place } from '../components/PlaceCard';
import { AddPlaceForm } from '../components/AddPlaceForm';
import { MapView } from '../components/MapView';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { mockPlaces } from '../data/mockPlaces';
import { useToast } from '../hooks/use-toast';
import heroImage from '../assets/hero-bg.jpg';

const Index = () => {
  const [places, setPlaces] = useState<Place[]>(mockPlaces);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('tous');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const { toast } = useToast();

  // Filtrage et recherche
  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           place.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           place.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = filterType === 'tous' || place.type === filterType;
      
      return matchesSearch && matchesType;
    });
  }, [places, searchQuery, filterType]);

  const placeTypes = ['tous', ...Array.from(new Set(places.map(p => p.type)))];

  const handleAddPlace = (newPlace: any) => {
    setPlaces(prev => [newPlace, ...prev]);
    setShowAddForm(false);
    toast({
      title: "🎉 Lieu ajouté !",
      description: "Votre lieu a été partagé avec la communauté.",
    });
  };

  const handleLike = (id: string) => {
    setPlaces(prev => prev.map(place => 
      place.id === id 
        ? { 
            ...place, 
            isLiked: !place.isLiked,
            likes: place.isLiked ? place.likes - 1 : place.likes + 1
          }
        : place
    ));
  };

  const handleComment = (id: string) => {
    toast({
      title: "💬 Fonctionnalité en développement",
      description: "Les commentaires seront bientôt disponibles !",
    });
  };

  const handleReport = (id: string) => {
    toast({
      title: "🚨 Signalement envoyé",
      description: "Merci de nous aider à maintenir la qualité de la communauté.",
    });
  };

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-background">
        <Header onAddPlace={() => setShowAddForm(false)} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <AddPlaceForm
            onSubmit={handleAddPlace}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onAddPlace={() => setShowAddForm(true)}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={heroImage}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
                Découvrez des lieux 
                <span className="bg-gradient-instagram bg-clip-text text-transparent"> incroyables</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Partagez vos endroits favoris et découvrez les recommandations de la communauté
              </p>
              <div className="flex gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="btn-instagram text-lg px-8 py-4"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Partager un lieu
                </Button>
                <Button
                  variant="outline"
                  className="text-white border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-lg px-8 py-4"
                  onClick={() => document.getElementById('places-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explorer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section principale */}
      <section id="places-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Barre de contrôles */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-foreground">
              {filteredPlaces.length} lieu{filteredPlaces.length > 1 ? 'x' : ''} découvert{filteredPlaces.length > 1 ? 's' : ''}
            </h2>
            {searchQuery && (
              <span className="text-sm text-muted-foreground">
                pour "{searchQuery}"
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Filtre par type */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {placeTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type === 'tous' ? 'Tous' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sélecteur de vue */}
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'btn-sunset' : ''}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
                className={viewMode === 'map' ? 'btn-sunset' : ''}
              >
                <Map className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        {viewMode === 'map' ? (
          <MapView 
            places={filteredPlaces}
            onPlaceSelect={setSelectedPlace}
            className="mb-8"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place, index) => (
              <div
                key={place.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PlaceCard
                  place={place}
                  onLike={handleLike}
                  onComment={handleComment}
                  onReport={handleReport}
                />
              </div>
            ))}
          </div>
        )}

        {/* Message si aucun résultat */}
        {filteredPlaces.length === 0 && (
          <div className="text-center py-16">
            <div className="animate-float">
              <Sparkles className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              Aucun lieu trouvé
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || filterType !== 'tous' 
                ? "Essayez de modifier vos critères de recherche"
                : "Soyez le premier à partager un lieu incroyable !"
              }
            </p>
            <Button onClick={() => setShowAddForm(true)} className="btn-instagram">
              <Sparkles className="w-4 h-4 mr-2" />
              Ajouter le premier lieu
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
