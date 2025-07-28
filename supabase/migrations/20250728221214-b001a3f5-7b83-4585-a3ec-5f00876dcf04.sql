-- Créer le bucket pour les images de lieux
INSERT INTO storage.buckets (id, name, public) VALUES ('place-images', 'place-images', true);

-- Politique pour permettre à tous de voir les images
CREATE POLICY "Place images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'place-images');

-- Politique pour permettre aux utilisateurs connectés d'uploader des images
CREATE POLICY "Users can upload place images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'place-images' AND auth.uid() IS NOT NULL);

-- Politique pour permettre aux utilisateurs de mettre à jour leurs propres images
CREATE POLICY "Users can update their own place images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'place-images' AND auth.uid() IS NOT NULL);

-- Politique pour permettre aux utilisateurs de supprimer leurs propres images  
CREATE POLICY "Users can delete their own place images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'place-images' AND auth.uid() IS NOT NULL);