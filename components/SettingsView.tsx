
import React from 'react';
import { ChevronRight, LogOut, Shield, Bell, HelpCircle, Moon } from 'lucide-react';
import { CuisineType, DietaryTag } from '../types';

interface SettingsViewProps {
  selectedCuisines: CuisineType[];
  selectedDietary: DietaryTag[];
  onToggleCuisine: (c: CuisineType) => void;
  onToggleDietary: (d: DietaryTag) => void;
}

const CUISINES: CuisineType[] = ['American', 'Italian', 'Japanese', 'Mexican', 'Indian', 'Thai', 'Korean', 'Chinese', 'French', 'Mediterranean'];
const DIETARY: DietaryTag[] = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo'];

const SettingsView: React.FC<SettingsViewProps> = ({ 
  selectedCuisines, 
  selectedDietary,
  onToggleCuisine,
  onToggleDietary
}) => {
  return (
    <div className="h-full bg-amber-50/30 overflow-y-auto no-scrollbar pb-32">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Discovery Settings</h2>
        
        <section className="mb-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Cuisine Preferences</h3>
          <div className="flex flex-wrap gap-2">
            {CUISINES.map(cuisine => (
              <button
                key={cuisine}
                onClick={() => onToggleCuisine(cuisine)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCuisines.includes(cuisine)
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                    : 'bg-white text-gray-600 border border-gray-100 hover:border-orange-200'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Dietary Restrictions</h3>
          <div className="flex flex-wrap gap-2">
            {DIETARY.map(tag => (
              <button
                key={tag}
                onClick={() => onToggleDietary(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedDietary.includes(tag)
                    ? 'bg-green-500 text-white shadow-md shadow-green-100'
                    : 'bg-white text-gray-600 border border-gray-100 hover:border-green-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Account</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {[
              { icon: Bell, label: 'Notifications', color: 'text-blue-500' },
              { icon: Shield, label: 'Privacy & Security', color: 'text-purple-500' },
              { icon: Moon, label: 'Dark Mode', color: 'text-gray-700' },
              { icon: HelpCircle, label: 'Help & Support', color: 'text-amber-500' },
            ].map((item, idx) => (
              <button key={idx} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.color} bg-opacity-10`}>
                    <item.icon size={20} className={item.color} />
                  </div>
                  <span className="font-medium text-gray-700">{item.label}</span>
                </div>
                <ChevronRight size={20} className="text-gray-300" />
              </button>
            ))}
          </div>
        </section>

        <button className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-bold bg-white rounded-2xl shadow-sm border border-red-50 hover:bg-red-50 transition-all">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
