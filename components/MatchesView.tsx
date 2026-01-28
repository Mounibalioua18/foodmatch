
import React from 'react';
import { Trash2, MessageCircle, Users, Heart } from 'lucide-react';
import { SocialMatch } from '../types';
import { FOOD_ITEMS } from '../data/foodItems';

interface MatchesViewProps {
  matches: SocialMatch[];
  onRemoveMatch: (id: string) => void;
}

const MatchesView: React.FC<MatchesViewProps> = ({ matches, onRemoveMatch }) => {
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-10 pb-20">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Users size={48} className="text-orange-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Finding your foodies...</h2>
        <p className="text-gray-500">Keep swiping right on your favorite dishes to find people who share your taste buds!</p>
      </div>
    );
  }

  // Sort matches by match strength (most shared foods first)
  const sortedMatches = [...matches].sort((a, b) => b.sharedFoodIds.length - a.sharedFoodIds.length);

  return (
    <div className="h-full bg-[#FAFAFA] p-6 overflow-y-auto no-scrollbar pb-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Matches</h2>
          <p className="text-gray-500 text-sm font-medium">People who love what you love.</p>
        </div>
        <div className="bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg shadow-orange-200">
          {matches.length}
        </div>
      </div>

      <div className="space-y-4">
        {sortedMatches.map((match) => (
          <div key={match.userId} className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-xl hover:scale-[1.02] transition-all group">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-orange-50 bg-gray-50">
                <img src={match.profilePic} alt={match.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-red-500 text-white p-1 rounded-lg shadow-md">
                <Heart size={12} className="fill-white" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-800 truncate">{match.name}</h3>
                <span className="bg-green-100 text-green-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                  {Math.min(match.sharedFoodIds.length * 20, 100)}% Match
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">Shared Favorites:</p>
              <div className="flex flex-wrap gap-1">
                {match.sharedFoodIds.slice(0, 3).map(id => {
                  const food = FOOD_ITEMS.find(f => f.id === id);
                  return (
                    <span key={id} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-bold truncate max-w-[80px]">
                      {food?.name}
                    </span>
                  );
                })}
                {match.sharedFoodIds.length > 3 && (
                  <span className="text-[10px] text-gray-400 font-bold px-1">+{match.sharedFoodIds.length - 3}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button 
                onClick={() => onRemoveMatch(match.userId)}
                className="p-2 text-gray-300 hover:text-red-500 transition-colors self-end"
              >
                <Trash2 size={16} />
              </button>
              <button className="bg-orange-500 text-white p-4 rounded-2xl shadow-lg shadow-orange-100 hover:bg-orange-600 active:scale-90 transition-all">
                <MessageCircle size={22} className="fill-white/10" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchesView;
