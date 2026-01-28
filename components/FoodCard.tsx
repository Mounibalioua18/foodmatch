
import React from 'react';
import { Star, MapPin, Info } from 'lucide-react';
import { FoodItem } from '../types';

interface FoodCardProps {
  food: FoodItem;
  rotation?: number;
  opacity?: number;
  offsetX?: number;
  offsetY?: number;
}

const FoodCard: React.FC<FoodCardProps> = ({ 
  food, 
  rotation = 0, 
  opacity = 1,
  offsetX = 0,
  offsetY = 0
}) => {
  return (
    <div 
      className="absolute inset-0 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 touch-none pointer-events-none"
      style={{
        transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`,
        opacity: opacity,
        transition: offsetX === 0 ? 'transform 0.5s ease-out, opacity 0.5s' : 'none'
      }}
    >
      <div className="relative h-2/3">
        <img 
          src={food.image} 
          alt={food.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star size={14} className="text-amber-500 fill-amber-500" />
          <span className="text-sm font-bold text-gray-800">{food.rating}</span>
        </div>

        <div className="absolute bottom-4 left-6 right-6">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
              {food.cuisine}
            </span>
            {food.dietaryTags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/30">
                {tag}
              </span>
            ))}
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{food.name}</h2>
          <p className="text-white/80 text-sm line-clamp-2">{food.description}</p>
        </div>
      </div>

      <div className="p-6 bg-white flex flex-col justify-between h-1/3">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin size={16} />
              <span className="text-sm">Nearby Restaurant</span>
            </div>
            <div className="font-bold text-orange-600">{food.priceRange}</div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <Info size={16} className="text-orange-600" />
            </div>
            <p>Popular choice for {food.cuisine} lovers!</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
          <span>Swipe right to Match</span>
          <span>Swipe left to Pass</span>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
