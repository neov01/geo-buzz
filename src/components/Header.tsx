import React from 'react';
import { MapPin, Plus, Search, Menu, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface HeaderProps {
  onAddPlace?: () => void;
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onAddPlace,
  onSearch,
  searchQuery = ""
}) => {
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/20 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo et titre */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-instagram p-2 rounded-xl">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-instagram bg-clip-text text-transparent">
                PlaceShare
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Découvrez et partagez vos lieux favoris
              </p>
            </div>
          </div>

          {/* Barre de recherche - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher un lieu, une ville..."
                value={searchQuery}
                onChange={(e) => onSearch?.(e.target.value)}
                className="input-modern pl-10 pr-4"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Bouton mobile search */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-muted-foreground hover:text-foreground"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Bouton ajouter */}
            <Button
              onClick={onAddPlace}
              className="btn-instagram hidden sm:flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Ajouter un lieu
            </Button>

            {/* Bouton ajouter mobile */}
            <Button
              onClick={onAddPlace}
              className="btn-instagram sm:hidden p-2"
            >
              <Plus className="w-5 h-5" />
            </Button>

            {/* Menu utilisateur */}
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <User className="w-5 h-5" />
            </Button>

            {/* Menu mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Barre de recherche mobile */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => onSearch?.(e.target.value)}
              className="input-modern pl-10 pr-4"
            />
          </div>
        </div>
      </div>
    </header>
  );
};