
import React from 'react';
import { MessageSquare, Send, Search } from 'lucide-react';

const MessagesView: React.FC = () => {
  return (
    <div className="h-full bg-white flex flex-col pb-32">
      <div className="p-6">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Messages</h2>
        <p className="text-gray-500 text-sm font-medium">Chat with your foodie matches.</p>
        
        <div className="mt-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search conversations..." 
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
          <MessageSquare size={32} className="text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No messages yet</h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          Matches will appear here once you send them a message from the Matches tab.
        </p>
        <button className="mt-6 px-8 py-3 bg-orange-500 text-white rounded-2xl font-black shadow-lg shadow-orange-100 active:scale-95 transition-transform">
          Start a Conversation
        </button>
      </div>
    </div>
  );
};

export default MessagesView;
