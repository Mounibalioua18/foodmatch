
import React, { useState } from 'react';
import { UtensilsCrossed, Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck } from 'lucide-react';
import { User } from '../types';
import { firebase } from '../lib/firebase';

interface AuthViewProps {
  onAuthComplete: (user: User) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthComplete }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Sanitize email to use as ID
    const userId = formData.email.replace(/[.$#[\]/]/g, "_"); 
    
    try {
      if (isLogin) {
        const existing = await firebase.getUser(userId);
        if (existing) {
          // In a real app with Firebase Auth SDK, you'd call signInWithEmailAndPassword here.
          // For now, we simulate success if the profile exists.
          onAuthComplete(existing);
        } else {
          alert("Account not found. Please register first.");
          setIsLogin(false);
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match!");
          setLoading(false);
          return;
        }

        const newUser: User = {
          id: userId,
          name: formData.name,
          email: formData.email,
          profilePic: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${formData.name || formData.email}`,
          joinedAt: Date.now()
        };
        
        // SAVE PROFILE (WITHOUT PASSWORD) TO DATABASE
        await firebase.putUser(newUser);
        onAuthComplete(newUser);
      }
    } catch (err) {
      alert("Something went wrong. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-orange-500 to-red-600 overflow-y-auto no-scrollbar">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl mb-8">
          <UtensilsCrossed size={48} className="text-orange-500" />
        </div>
        
        <div className="text-center mb-10 text-white">
          <h1 className="text-5xl font-black mb-2 tracking-tighter">FoodMatch</h1>
          <p className="opacity-80 font-medium">Find your foodie soulmate.</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          {!isLogin && (
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
              <input 
                required
                type="text" 
                placeholder="Name"
                className="w-full bg-white/20 border border-white/30 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/30"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
            <input 
              required
              type="email" 
              placeholder="Email"
              className="w-full bg-white/20 border border-white/30 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/30"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
            <input 
              required
              type="password" 
              placeholder="Password"
              className="w-full bg-white/20 border border-white/30 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/30"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          {!isLogin && (
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
              <input 
                required
                type="password" 
                placeholder="Confirm Password"
                className="w-full bg-white/20 border border-white/30 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/30"
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-white text-orange-600 font-black py-5 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group mt-4"
          >
            {loading ? "Please wait..." : (isLogin ? "LOG IN" : "START SWIPING")}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>
      </div>

      <div className="p-8 text-center bg-black/10">
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-white/80 hover:text-white font-bold text-sm tracking-widest uppercase"
        >
          {isLogin ? "Need an account? Sign up" : "Already a member? Log in"}
        </button>
      </div>
    </div>
  );
};

export default AuthView;
