
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STALLS } from '../constants';
import { Stall, Product, User } from '../types';
import { Star, ShoppingBag, ArrowLeft, Heart, Users, ShieldCheck, CreditCard, CheckCircle2 } from 'lucide-react';
import { storageService } from '../services/storageService';
import { SmartImage } from './SmartImage';

export const BazaarSection: React.FC<{ onBook: (item: any) => void }> = ({ onBook }) => {
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [registrationType, setRegistrationType] = useState<'artisan' | 'business' | 'guide'>('artisan');

  useEffect(() => {
    setCurrentUser(storageService.getCurrentUser());
  }, []);

  const handleToggleFavorite = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    if (!currentUser) {
      alert('Please sign in to save favorites');
      return;
    }
    storageService.toggleFavorite(currentUser.id, itemId);
    // Refresh current user to update UI
    setCurrentUser(storageService.getCurrentUser());
  };

  const isFavorite = (itemId: string) => {
    return currentUser?.favorites?.includes(itemId) || false;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <AnimatePresence mode="wait">
        {!selectedStall ? (
          <motion.div
            key="stall-list"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
              <div>
                <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">Grand Bazaar</h2>
                <p className="text-slate-600">Connect directly with Morocco's finest artisans.</p>
              </div>
              <button 
                onClick={() => setShowJoinModal(true)}
                className="flex items-center gap-2 bg-cedar text-white px-6 py-3 rounded-2xl font-bold hover:bg-gold transition-all shadow-lg shadow-cedar/20"
              >
                <Users className="w-5 h-5" /> Join the Network
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {STALLS.map((stall) => (
                <motion.div 
                  key={stall.id}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedStall(stall)}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 cursor-pointer group flex"
                >
                  <div className="w-1/3 overflow-hidden h-48 sm:h-auto">
                    <SmartImage 
                      src={stall.image} 
                      alt={stall.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-110" 
                    />
                  </div>
                  <div className="p-8 w-2/3 relative">
                    <button 
                      onClick={(e) => handleToggleFavorite(e, stall.id)}
                      className={`absolute top-6 right-6 p-2 rounded-full transition-all ${
                        isFavorite(stall.id) ? 'bg-marrakech text-white' : 'bg-slate-100 text-slate-400 hover:text-marrakech'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite(stall.id) ? 'fill-current' : ''}`} />
                    </button>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold text-slate-900 line-clamp-1">{stall.name}</h3>
                      <div className="flex items-center gap-1 text-gold font-bold shrink-0">
                        <Star className="w-4 h-4 fill-gold" />
                        <span>{stall.rating}</span>
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">{stall.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[10px] uppercase font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-600">Verified Artisan</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`stall-detail-${selectedStall.id}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              onClick={() => setSelectedStall(null)}
              className="flex items-center gap-2 text-slate-600 mb-8 hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Bazaar
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <SmartImage src={selectedStall.image} alt={selectedStall.name} className="w-full rounded-3xl shadow-xl aspect-square object-cover mb-6" />
                <h2 className="text-4xl font-serif font-bold mb-4">{selectedStall.name}</h2>
                <div className="p-6 bg-gold/5 rounded-2xl border border-gold/10 mb-6">
                  <div className="text-sm font-bold text-cedar mb-1">Owner</div>
                  <div className="text-lg font-bold text-slate-900">{selectedStall.owner}</div>
                  <p className="text-sm text-slate-600 mt-2">Specializing in ancestral techniques passed down through generations.</p>
                </div>
              </div>

              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold mb-8">Crafted Works</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {selectedStall.products.map((product) => (
                    <div 
                      key={product.id}
                      className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 group"
                    >
                      <div className="relative overflow-hidden rounded-xl mb-4">
                        <SmartImage src={product.image} alt={product.name} className="w-full aspect-video object-cover transition-transform group-hover:scale-105" />
                        <button 
                          onClick={(e) => handleToggleFavorite(e, product.id)}
                          className={`absolute top-3 right-3 p-2 backdrop-blur rounded-full transition-all ${
                            isFavorite(product.id) ? 'bg-marrakech text-white' : 'bg-white/80 text-slate-400 hover:text-marrakech'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{product.category}</div>
                          <h4 className="font-bold text-slate-900">{product.name}</h4>
                          <div className="text-xl font-black text-marrakech mt-1">${product.price}</div>
                        </div>
                        <button 
                          onClick={() => onBook({ ...product, stall: selectedStall.name })}
                          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-cedar transition-all"
                        >
                          <ShoppingBag className="w-4 h-4" /> Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showJoinModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowJoinModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              <div className="w-full md:w-2/5 bg-cedar p-10 text-white flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                    <ShieldCheck className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="text-3xl font-serif font-bold mb-4">Join the Sojourn Network</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-8">
                    Empower your business and connect with global travelers seeking authentic Moroccan experiences.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-gold" />
                      <span>Verified Badge</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-gold" />
                      <span>Direct Booking Tools</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-gold" />
                      <span>Analytics Dashboard</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12 pt-8 border-t border-white/10">
                  <div className="text-xs font-bold text-gold uppercase tracking-widest mb-2">Subscription</div>
                  <div className="text-2xl font-bold">$29<span className="text-sm font-normal text-white/60">/month</span></div>
                </div>
              </div>

              <div className="w-full md:w-3/5 p-10">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-xl font-bold">Registration</h4>
                  <button onClick={() => setShowJoinModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">I am a...</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['artisan', 'business', 'guide'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setRegistrationType(type)}
                          className={`py-3 rounded-xl border text-xs font-bold transition-all capitalize ${
                            registrationType === type 
                              ? 'bg-gold border-gold text-white shadow-md' 
                              : 'bg-white border-slate-100 text-slate-500 hover:border-gold/40'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Business/Stall Name" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-gold transition-all"
                    />
                    <input 
                      type="email" 
                      placeholder="Contact Email" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-gold transition-all"
                    />
                    <textarea 
                      placeholder="Tell us about your craft/service..." 
                      rows={3}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-gold transition-all resize-none"
                    />
                  </div>

                  <div className="pt-4">
                    <button className="w-full bg-gold text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-cedar transition-all shadow-lg shadow-gold/20">
                      <CreditCard className="w-5 h-5" /> Start Subscription
                    </button>
                    <p className="text-[10px] text-center text-slate-400 mt-4">
                      By joining, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
