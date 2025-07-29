-- Fix the rating constraint to allow ratings from 1 to 5
ALTER TABLE places 
DROP CONSTRAINT IF EXISTS places_rating_check;

ALTER TABLE places 
ADD CONSTRAINT places_rating_check 
CHECK (rating >= 1 AND rating <= 5);