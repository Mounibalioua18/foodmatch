
import React, { useState } from 'react';
import { User } from '../types';
import { Trash2, Calendar, Mail, LogOut, Heart, Edit2, Check, RefreshCw, Quote, Shield } from 'lucide-react';
import { firebase } from '../lib/firebase';

interface ProfileViewProps {
  user: User;
  onLogout: () => void;
  onDeleteAccount: () => void;
  likesCount: number;
  onUpdateUser: (updatedUser: User) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout, onDeleteAccount, likesCount, onUpdateUser }) => {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(user.bio || "");
  const [loading, setLoading] = useState(false);

  const saveBio = async () => {
    setLoading(true);
    const updatedUser = { ...user, bio: bioText };
    await firebase.putUser(updatedUser);
    onUpdateUser(updatedUser);
    setIsEditingBio(false);
    setLoading(false);
  };

  const changeAvatar = async () => {
    const newSeed = Math.random().toString(36).substring(7);
    const newPic = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${newSeed}`;
    const updatedUser = { ...user, profilePic: newPic, avatarSeed: newSeed };
    await firebase.putUser(updatedUser);
    onUpdateUser(updatedUser);
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto no-scrollbar pb-32">
      {/* Header / Hero Section */}
      <div className="relative h-72 bg-gradient-to-b from-orange-500 to-orange-600 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
        {/* Background blobs for depth */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black/10 rounded-full blur-3xl"></div>

        <div className="relative mb-4 group">
          <div className="w-32 h-32 rounded-[2.5rem] bg-white p-1 shadow-2xl transition-transform duration-500 group-hover:scale-105">
            <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-gray-100 border border-gray-100">
              <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
            </div>
          </div>
          <button 
            onClick={changeAvatar}
            className="absolute -bottom-1 -right-1 bg-white text-orange-600 p-2.5 rounded-2xl shadow-xl hover:bg-orange-50 transition-all border-2 border-orange-500 active:scale-90"
            title="Update Profile Picture"
          >
            <RefreshCw size={18} />
          </button>
        </div>
        
        <h2 className="text-2xl font-black tracking-tight drop-shadow-sm">{user.name}</h2>
        <div className="flex items-center gap-1.5 mt-1 bg-black/10 px-3 py-1 rounded-full backdrop-blur-sm">
          <Shield size={12} className="text-orange-200" />
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-50">Verified Foodie</span>
        </div>
      </div>

      <div className="px-6 -mt-8 relative z-10">
        {/* Stats Section - Improved spacing and sizes */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-orange-900/5 grid grid-cols-2 gap-6 border border-orange-100/50 mb-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-2">
              <Heart className="text-red-500 fill-red-500/10" size={24} />
            </div>
            <span className="text-2xl font-black text-gray-800 leading-none">{likesCount}</span>
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1.5">Liked Dishes</span>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-2">
              <Calendar className="text-blue-500" size={24} />
            </div>
            <span className="text-lg font-black text-gray-800 leading-none">
              {new Date(user.joinedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
            </span>
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1.5">Member Since</span>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white rounded-[2rem] p-7 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Quote size={14} className="text-orange-400" />
              Your Taste Profile
            </h3>
            <button 
              onClick={() => isEditingBio ? saveBio() : setIsEditingBio(true)}
              className="text-orange-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 bg-orange-50 px-4 py-2 rounded-xl hover:bg-orange-100 transition-all active:scale-95"
            >
              {isEditingBio ? <><Check size={12} /> Save</> : <><Edit2 size={12} /> Edit</>}
            </button>
          </div>

          {isEditingBio ? (
            <textarea 
              className="w-full bg-gray-50 rounded-2xl p-4 text-gray-700 font-medium text-sm focus:outline-none ring-2 ring-orange-500/20 h-32 resize-none border-none"
              placeholder="Tell other foodies what you're craving..."
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              autoFocus
            />
          ) : (
            <p className="text-gray-600 text-sm leading-relaxed font-medium italic">
              {user.bio || "No bio yet. Tap 'Edit' to share your favorite flavors and let others know what you're looking for!"}
            </p>
          )}
        </div>

        {/* Details Section */}
        <div className="bg-white rounded-[2rem] p-2 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
              <Mail size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Email Address</p>
              <p className="text-gray-700 font-bold truncate text-sm">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 px-2">
          <button 
            onClick={onLogout}
            className="w-full py-4 bg-gray-100 text-gray-600 font-black uppercase tracking-[0.15em] text-[10px] rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-95"
          >
            <LogOut size={16} />
            Sign Out
          </button>
          <button 
            onClick={() => confirm("Permanently delete account?") && onDeleteAccount()}
            className="w-full py-3 text-red-400 font-bold text-[10px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
          >
            <Trash2 size={14} />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
