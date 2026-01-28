
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Heart, Star, UtensilsCrossed, Settings as SettingsIcon, Heart as HeartIcon, MessageCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import FoodCard from './components/FoodCard';
import MatchesView from './components/MatchesView';
import MessagesView from './components/MessagesView';
import SettingsView from './components/SettingsView';
import AuthView from './components/AuthView';
import ProfileView from './components/ProfileView';
import { FOOD_ITEMS } from './data/foodItems';
import { FoodItem, AppView, SwipeDirection, CuisineType, DietaryTag, User, SocialMatch } from './types';
import { firebase } from './lib/firebase';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('auth');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [socialMatches, setSocialMatches] = useState<SocialMatch[]>([]);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<number[]>([]);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [lastMatchedUser, setLastMatchedUser] = useState<SocialMatch | null>(null);

  const [selectedCuisines, setSelectedCuisines] = useState<CuisineType[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<DietaryTag[]>([]);

  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('foodmatch_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCurrentUser(parsed);
      setView('swipe');
      loadInitialData(parsed.id);
    }
  }, []);

  const loadInitialData = async (userId: string) => {
    const likes = await firebase.getLikes(userId);
    setUserLikes(likes);
    calculateSocialMatches(userId, likes);
  };

  const calculateSocialMatches = async (myId: string, myLikes: Record<string, boolean>) => {
    const allLikes = await firebase.getAllLikes();
    const allUsers = await firebase.getAllUsers();
    const matches: SocialMatch[] = [];

    const myLikedIds = Object.keys(myLikes);
    if (myLikedIds.length === 0) return;

    Object.entries(allLikes).forEach(([userId, theirLikes]) => {
      if (userId === myId) return;
      
      const sharedFoodIds = myLikedIds.filter(foodId => theirLikes[foodId]);
      if (sharedFoodIds.length > 0 && allUsers[userId]) {
        matches.push({
          userId,
          name: allUsers[userId].name,
          profilePic: allUsers[userId].profilePic,
          sharedFoodIds,
          matchStrength: Math.min(sharedFoodIds.length * 20, 100)
        });
      }
    });

    setSocialMatches(matches);
  };

  const handleAuthComplete = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('foodmatch_user', JSON.stringify(user));
    setView('swipe');
    loadInitialData(user.id);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('foodmatch_user');
    setView('auth');
  };

  const handleDeleteAccount = async () => {
    if (currentUser) {
      await firebase.deleteUser(currentUser.id);
      handleLogout();
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('foodmatch_user', JSON.stringify(updatedUser));
  };

  const filteredFoods = FOOD_ITEMS.filter(food => {
    const matchesCuisine = selectedCuisines.length === 0 || selectedCuisines.includes(food.cuisine);
    const matchesDietary = selectedDietary.length === 0 || selectedDietary.every(d => food.dietaryTags.includes(d));
    const notYetLiked = !userLikes[food.id];
    return matchesCuisine && matchesDietary && notYetLiked;
  });

  const currentFood = filteredFoods[currentIndex];
  const nextFood = filteredFoods[currentIndex + 1];

  const handleSwipe = useCallback(async (direction: SwipeDirection) => {
    if (!currentFood || !currentUser) return;

    setHistory(prev => [...prev, currentIndex]);

    if (direction === 'right' || direction === 'up') {
      await firebase.saveLike(currentUser.id, currentFood.id);
      const newLikes = { ...userLikes, [currentFood.id]: true };
      setUserLikes(newLikes);
      
      const allLikes = await firebase.getAllLikes();
      const allUsers = await firebase.getAllUsers();
      
      let foundMatch: SocialMatch | null = null;
      Object.entries(allLikes).forEach(([userId, theirLikes]) => {
        if (userId === currentUser.id) return;
        if (theirLikes[currentFood.id] && allUsers[userId]) {
          foundMatch = {
            userId,
            name: allUsers[userId].name,
            profilePic: allUsers[userId].profilePic,
            sharedFoodIds: [currentFood.id],
            matchStrength: 20
          };
        }
      });

      if (foundMatch && direction === 'right') {
        setLastMatchedUser(foundMatch);
        setShowMatchAnimation(true);
      }
      
      calculateSocialMatches(currentUser.id, newLikes);
    }

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDragOffset({ x: 0, y: 0 });
      if (direction === 'right') {
         setTimeout(() => setShowMatchAnimation(false), 2500);
      }
    }, 300);
  }, [currentFood, currentIndex, currentUser, userLikes]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startPos.current = { x: clientX, y: clientY };
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const x = clientX - startPos.current.x;
    const y = clientY - startPos.current.y;
    setDragOffset({ x, y });
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (dragOffset.x > 120) handleSwipe('right');
    else if (dragOffset.x < -120) handleSwipe('left');
    else if (dragOffset.y < -120) handleSwipe('up');
    else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  if (view === 'auth') {
    return <AuthView onAuthComplete={handleAuthComplete} />;
  }

  return (
    <div className="h-screen w-full flex flex-col bg-amber-50 overflow-hidden max-w-md mx-auto relative shadow-2xl">
      <Navbar 
        onSettingsClick={() => setView('settings')} 
        onProfileClick={() => setView('profile')} 
        currentUser={currentUser}
      />

      <main className="flex-1 relative overflow-hidden bg-white">
        {view === 'swipe' && (
          <div className="h-full flex flex-col items-center justify-center p-4 bg-amber-50/30">
            <div 
              className="relative w-full aspect-[3/4] max-w-sm mb-6 perspective-1000"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
            >
              {nextFood && <div className="scale-95 opacity-50 absolute inset-0"><FoodCard food={nextFood} /></div>}
              {currentFood ? (
                <FoodCard food={currentFood} rotation={dragOffset.x * 0.1} offsetX={dragOffset.x} offsetY={dragOffset.y} />
              ) : (
                <div className="absolute inset-0 bg-white/50 border-2 border-dashed border-amber-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-8">
                  <UtensilsCrossed size={48} className="text-amber-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-700">Bon Appétit!</h3>
                  <p className="text-gray-500 mt-2">You've seen all dishes in your area.</p>
                  <button onClick={() => { setSelectedCuisines([]); setSelectedDietary([]); setCurrentIndex(0); }} className="mt-6 px-8 py-3 bg-orange-500 text-white rounded-2xl font-black shadow-lg">Reset Filters</button>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-5 w-full">
              <button onClick={() => handleSwipe('left')} className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl text-red-500 active:scale-90"><X size={32} /></button>
              <button onClick={() => handleSwipe('up')} className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl text-blue-400 active:scale-90"><Star size={24} className="fill-blue-400" /></button>
              <button onClick={() => handleSwipe('right')} className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl text-green-500 active:scale-90"><Heart size={32} className="fill-green-500" /></button>
            </div>
          </div>
        )}

        {view === 'matches' && <MatchesView matches={socialMatches} onRemoveMatch={(id) => setSocialMatches(prev => prev.filter(m => m.userId !== id))} />}
        {view === 'messages' && <MessagesView />}
        {view === 'profile' && currentUser && <ProfileView user={currentUser} onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} likesCount={Object.keys(userLikes).length} onUpdateUser={handleUpdateUser} />}
        {view === 'settings' && <SettingsView selectedCuisines={selectedCuisines} selectedDietary={selectedDietary} onToggleCuisine={(c) => { setSelectedCuisines(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]); setCurrentIndex(0); }} onToggleDietary={(d) => { setSelectedDietary(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]); setCurrentIndex(0); }} />}
      </main>

      {/* Bottom Navigation Bar */}
      <div className="h-24 bg-white/95 backdrop-blur-md border-t border-amber-100 flex items-center justify-around px-6 sticky bottom-0 z-50 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setView('swipe')} 
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'swipe' ? 'text-orange-500 scale-110' : 'text-gray-300'}`}
        >
          <div className={`p-2 rounded-2xl ${view === 'swipe' ? 'bg-orange-50' : ''}`}>
            <UtensilsCrossed size={22} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Discover</span>
        </button>
        
        <button 
          onClick={() => setView('matches')} 
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'matches' ? 'text-orange-500 scale-110' : 'text-gray-300'}`}
        >
          <div className={`p-2 rounded-2xl relative ${view === 'matches' ? 'bg-orange-50' : ''}`}>
            <HeartIcon size={22} className={view === 'matches' ? 'fill-orange-500' : ''} />
            {socialMatches.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black border-2 border-white">
                {socialMatches.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Matches</span>
        </button>

        <button 
          onClick={() => setView('messages')} 
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'messages' ? 'text-orange-500 scale-110' : 'text-gray-300'}`}
        >
          <div className={`p-2 rounded-2xl ${view === 'messages' ? 'bg-orange-50' : ''}`}>
            <MessageCircle size={22} className={view === 'messages' ? 'fill-orange-500' : ''} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Messages</span>
        </button>
      </div>

      {showMatchAnimation && (
        <div className="fixed inset-0 z-[100] bg-orange-600/95 backdrop-blur-md flex flex-col items-center justify-center text-white p-10 animate-in fade-in zoom-in duration-500 text-center">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-24 h-24 rounded-[2rem] border-4 border-white overflow-hidden shadow-2xl transform -rotate-12 bg-white">
              <img src={currentUser?.profilePic} className="w-full h-full object-cover" />
            </div>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
              <Heart size={32} className="text-red-500 fill-red-500 animate-pulse" />
            </div>
            <div className="w-24 h-24 rounded-[2rem] border-4 border-white overflow-hidden shadow-2xl transform rotate-12 bg-white">
              <img src={lastMatchedUser?.profilePic} className="w-full h-full object-cover" />
            </div>
          </div>
          <h2 className="text-5xl font-black mb-4 tracking-tighter leading-none">IT'S A MATCH!</h2>
          <p className="text-xl text-white/90 mb-10">You and <strong>{lastMatchedUser?.name}</strong> both love that!</p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button onClick={() => { setShowMatchAnimation(false); setView('messages'); }} className="w-full py-5 bg-white text-orange-600 rounded-[2rem] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-transform">Start Chatting</button>
            <button onClick={() => setShowMatchAnimation(false)} className="w-full py-5 bg-white/20 text-white rounded-[2rem] font-bold border border-white/30 hover:bg-white/30 transition-all">Keep Hunting</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
