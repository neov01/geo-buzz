import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface DatabasePlace {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  rating: number;
  image_url: string | null;
  tags: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
  profiles: {
    display_name: string | null;
  } | null;
  place_likes: { user_id: string }[];
}

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

export const usePlaces = (userId?: string) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPlaces = async () => {
    try {
      console.log('Fetching places...');
      const { data, error } = await supabase
        .from('places')
        .select(`
          *,
          profiles(display_name),
          place_likes(user_id)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du fetch places:', error);
        throw error;
      }

      console.log('Places récupérées:', data);

      const formattedPlaces: Place[] = (data || []).map((place: any) => ({
        id: place.id,
        name: place.name,
        type: place.type,
        location: place.location,
        rating: place.rating,
        description: place.description,
        image: place.image_url || '/placeholder.svg',
        author: place.profiles?.display_name || 'Utilisateur anonyme',
        likes: place.place_likes?.length || 0,
        comments: 0, // TODO: implémenter les commentaires
        tags: place.tags || [],
        isLiked: userId ? place.place_likes?.some(like => like.user_id === userId) : false
      }));

      console.log('Places formatées:', formattedPlaces);
      setPlaces(formattedPlaces);
    } catch (error: any) {
      console.error('Error fetching places:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les lieux",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addPlace = async (placeData: {
    name: string;
    type: string;
    location: string;
    description: string;
    rating: number;
    tags: string[];
    image: string;
  }) => {
    console.log('addPlace appelé avec userId:', userId);
    console.log('addPlace appelé avec données:', placeData);
    
    if (!userId) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter un lieu",
        variant: "destructive"
      });
      return false;
    }

    // Validation des données
    if (!placeData.name || !placeData.type || !placeData.location || !placeData.description) {
      toast({
        title: "Erreur",
        description: "Tous les champs obligatoires doivent être remplis",
        variant: "destructive"
      });
      return false;
    }

    if (placeData.rating < 1 || placeData.rating > 5) {
      toast({
        title: "Erreur",
        description: "La note doit être entre 1 et 5",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('Tentative d\'insertion en base de données...');
      const { data, error } = await supabase.from('places').insert({
        name: placeData.name,
        type: placeData.type,
        location: placeData.location,
        description: placeData.description,
        rating: placeData.rating,
        tags: placeData.tags,
        image_url: placeData.image || null,
        user_id: userId
      }).select();

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      console.log('Lieu ajouté avec succès:', data);

      toast({
        title: "Lieu ajouté !",
        description: `${placeData.name} a été ajouté avec succès`,
      });

      fetchPlaces(); // Refresh the list
      return true;
    } catch (error: any) {
      console.error('Error adding place:', error);
      let errorMessage = "Impossible d'ajouter le lieu";
      
      if (error.code === 'PGRST116') {
        errorMessage = "Erreur de validation des données";
      } else if (error.message) {
        errorMessage = `Erreur: ${error.message}`;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  const toggleLike = async (placeId: string) => {
    if (!userId) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour aimer un lieu",
        variant: "destructive"
      });
      return;
    }

    try {
      const place = places.find(p => p.id === placeId);
      if (!place) return;

      if (place.isLiked) {
        // Unlike
        const { error } = await supabase
          .from('place_likes')
          .delete()
          .eq('place_id', placeId)
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('place_likes')
          .insert({ place_id: placeId, user_id: userId });

        if (error) throw error;
      }

      fetchPlaces(); // Refresh to update like counts
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le like",
        variant: "destructive"
      });
    }
  };

  const reportPlace = async (placeId: string, reason?: string) => {
    if (!userId) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour signaler un lieu",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('place_reports')
        .insert({ 
          place_id: placeId, 
          user_id: userId,
          reason 
        });

      if (error) throw error;

      toast({
        title: "Signalement envoyé",
        description: "Merci d'avoir signalé ce contenu",
      });
    } catch (error: any) {
      console.error('Error reporting place:', error);
      if (error.code === '23505') {
        toast({
          title: "Déjà signalé",
          description: "Vous avez déjà signalé ce lieu",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer le signalement",
          variant: "destructive"
        });
      }
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [userId]);

  return {
    places,
    loading,
    addPlace,
    toggleLike,
    reportPlace,
    refetch: fetchPlaces
  };
};