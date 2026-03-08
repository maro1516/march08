
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STALLS } from '../constants';
import { Stall, Product } from '../types';
import { Search, Filter, Star, ShoppingBag, Heart, ArrowRight, MapPin, Tag } from 'lucide-react';
import { SmartImage } from './SmartImage';

export const BrowseStalls: React.FC<{ onBook: (item: any) => void }> = ({ onBook }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);

  const categories = ['All', 'Carpets', 'Spices', 'Leather', 'Ceramics', 'Jewelry', 'Textiles'];

  const filteredStalls = STALLS.filter(stall => {
    const matchesSearch = stall.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         stall.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || stall.products.some(p => p.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <AnimatePresence mode="wait">
        {!selectedStall ? (
          <motion.div
            key="stall-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
              <div>
                <h2 className="text-5xl font-serif font-bold text-slate-900 mb-4">Artisan Marketplace</h2>
                <p className="text-slate-600 max-w-xl">Discover the soul of Morocco through its legendary craftsmanship. Connect directly with masters of ancestral techniques.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search artisans or products..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-200 focus:border-gold transition-all shadow-sm"
                  />
                </div>
                <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-gold transition-all shadow-sm">
                  <Filter className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-8 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                      ? 'bg-gold text-white shadow-lg shadow-gold/20' 
                      : 'bg-white text-slate-500 border border-slate-100 hover:border-gold/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStalls.map((stall) => (
                <motion.div 
                  key={stall.id}
                  layout
                  whileHover={{ y: -10 }}
                  onClick={() => setSelectedStall(stall)}
                  className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-slate-100 cursor-pointer group flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden">
                    <SmartImage 
                      src={stall.image} 
                      alt={stall.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1 text-white text-xs font-bold">
                      <Star className="w-3 h-3 fill-gold text-gold" />
                      {stall.rating}
                    </div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-3 h-3 text-gold" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Fez Medina</span>
                      </div>
                      <h3 className="text-2xl font-bold font-serif">{stall.name}</h3>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">{stall.description}</p>
                    <div className="mt-auto flex justify-between items-center">
                      <div className="flex -space-x-2">
                        {stall.products.slice(0, 3).map((p, i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-100">
                            <SmartImage src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {stall.products.length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            +{stall.products.length - 3}
                          </div>
                        )}
                      </div>
                      <span className="text-gold font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Visit Stall <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="stall-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <button 
              onClick={() => setSelectedStall(null)}
              className="flex items-center gap-2 text-slate-500 mb-12 hover:text-gold transition-colors font-bold"
            >
              <ArrowRight className="w-5 h-5 rotate-180" /> Back to Marketplace
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <SmartImage src={selectedStall.image} alt={selectedStall.name} className="w-full aspect-square rounded-[40px] shadow-2xl object-cover mb-8" />
                  <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">{selectedStall.name}</h2>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center gap-1 text-gold font-bold">
                      <Star className="w-5 h-5 fill-gold" />
                      <span>{selectedStall.rating}</span>
                    </div>
                    <div className="h-4 w-px bg-slate-200" />
                    <div className="text-slate-500 text-sm font-medium">124 Verified Reviews</div>
                  </div>
                  
                  <div className="p-8 bg-gold/5 rounded-[32px] border border-gold/10 mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStall.owner}`} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                      <div>
                        <div className="text-xs font-bold text-gold uppercase tracking-widest mb-0.5">Master Artisan</div>
                        <div className="text-lg font-bold text-slate-900">{selectedStall.owner}</div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed italic">
                      "Every piece tells a story of our heritage. We use only natural dyes and traditional looms passed down through five generations."
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-600">
                      <MapPin className="w-5 h-5 text-gold" />
                      <span className="text-sm">Derb El Horra, Fez Medina</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Tag className="w-5 h-5 text-gold" />
                      <span className="text-sm">Specializes in: {selectedStall.products[0].category}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-bold text-slate-900">Available Masterpieces</h3>
                  <div className="text-sm text-slate-400 font-medium">{selectedStall.products.length} Items</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {selectedStall.products.map((product) => (
                    <motion.div 
                      key={product.id}
                      whileHover={{ y: -5 }}
                      className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 group"
                    >
                      <div className="relative overflow-hidden rounded-2xl mb-6">
                        <SmartImage src={product.image} alt={product.name} className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105" />
                        <button className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-md rounded-full text-slate-400 hover:text-marrakech transition-all">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">{product.category}</div>
                          <h4 className="text-lg font-bold text-slate-900">{product.name}</h4>
                        </div>
                        <div className="text-2xl font-black text-marrakech">${product.price}</div>
                      </div>
                      <button 
                        onClick={() => onBook({ ...product, stall: selectedStall.name })}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gold transition-all shadow-lg shadow-slate-900/10"
                      >
                        <ShoppingBag className="w-5 h-5" /> Order Now
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
