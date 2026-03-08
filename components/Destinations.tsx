
import React, { useState, useEffect } from 'react';
import { POPULAR_CITIES } from '../constants';
import { City, Place, ReservationItem } from '../types';
import { MapPin, Plus, Check, Info, X, ShoppingCart, Calendar, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCityPlaces, fetchCityDetails, searchCities } from '../services/placeService';
import { Search } from 'lucide-react';
import { SmartImage } from './SmartImage';

interface DestinationsProps {
  roadmap: string[];
  onAddToRoadmap: (cityId: string) => void;
  onRemoveFromRoadmap: (cityId: string) => void;
  onAddToReservations: (item: ReservationItem) => void;
}

export const Destinations: React.FC<DestinationsProps> = ({ 
  roadmap, 
  onAddToRoadmap, 
  onRemoveFromRoadmap,
  onAddToReservations
}) => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [dynamicPlaces, setDynamicPlaces] = useState<Place[]>([]);
  const [dynamicCityDetails, setDynamicCityDetails] = useState<Partial<City> | null>(null);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Partial<City>[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await searchCities(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const displayedCities = searchResults.length > 0 ? searchResults : POPULAR_CITIES;

  useEffect(() => {
    if (selectedCity) {
      const loadData = async () => {
        setLoadingPlaces(true);
        setLoadingDetails(true);
        setDynamicPlaces([]);
        setDynamicCityDetails(null);
        
        try {
          // Fetch both in parallel
          const [places, details] = await Promise.all([
            fetchCityPlaces(selectedCity.name),
            fetchCityDetails(selectedCity.name)
          ]);
          setDynamicPlaces(places);
          setDynamicCityDetails(details);
        } catch (error) {
          console.error("Failed to fetch dynamic data:", error);
        } finally {
          setLoadingPlaces(false);
          setLoadingDetails(false);
        }
      };
      loadData();
    }
  }, [selectedCity]);

  const handleAddReservation = (city: City, place: Place) => {
    const newItem: ReservationItem = {
      id: Math.random().toString(36).substr(2, 9),
      cityId: city.id,
      placeId: place.id,
      name: place.name,
      price: place.price,
      category: place.category,
      date: new Date().toISOString().split('T')[0] // Default to today for now
    };
    onAddToReservations(newItem);
    alert(`${place.name} added to your reservations!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Explore Destinations</h2>
          <p className="text-slate-600 max-w-2xl">
            Discover the magic of Morocco. Search for any city or browse our curated list to plan your perfect journey.
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search cities (e.g. Agadir, Ouarzazate...)" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          {isSearching && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold animate-spin" />
          )}
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedCities.map((city) => {
          const isInRoadmap = roadmap.includes(city.id!);
          
          return (
            <motion.div 
              key={city.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500"
            >
              <div className="relative h-64 overflow-hidden">
                <SmartImage 
                  src={city.image!} 
                  alt={city.name!} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-gold" />
                    <span className="text-xs font-bold uppercase tracking-widest">{city.category}</span>
                  </div>
                  <h3 className="text-2xl font-bold font-serif">{city.name}</h3>
                </div>
                <button 
                  onClick={() => isInRoadmap ? onRemoveFromRoadmap(city.id!) : onAddToRoadmap(city.id!)}
                  className={`absolute top-6 right-6 p-3 rounded-2xl backdrop-blur-md transition-all ${
                    isInRoadmap 
                      ? 'bg-cedar text-white shadow-lg shadow-cedar/20' 
                      : 'bg-white/20 text-white hover:bg-white/40'
                  }`}
                >
                  {isInRoadmap ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
              </div>
              
              <div className="p-8">
                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                  {city.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {city.tags?.map(tag => (
                    <span key={tag} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-1 text-slate-900 font-bold">
                    <span className="text-xs text-slate-400 font-normal mr-1">Budget:</span>
                    {city.budget}
                  </div>
                  <button 
                    onClick={() => setSelectedCity(city as City)}
                    className="flex items-center gap-2 text-gold text-sm font-bold hover:underline"
                  >
                    <Info className="w-4 h-4" />
                    Details
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedCity && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCity(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="relative h-72 shrink-0">
                <SmartImage src={selectedCity.image} className="w-full h-full object-cover" alt={selectedCity.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <button 
                  onClick={() => setSelectedCity(null)}
                  className="absolute top-8 right-8 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-2xl text-white transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-4xl font-serif font-bold mb-2">{selectedCity.name}</h3>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-widest">
                      {selectedCity.category}
                    </span>
                    <span className="text-white/80 text-sm flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {selectedCity.coordinates?.lat}, {selectedCity.coordinates?.lng}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-10 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2">
                    <h4 className="text-xl font-serif font-bold text-slate-900 mb-4">About the City</h4>
                    {loadingDetails ? (
                      <div className="h-20 flex items-center gap-3 text-slate-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Fetching city insights...</span>
                      </div>
                    ) : (
                      <p className="text-slate-600 leading-relaxed mb-8">
                        {dynamicCityDetails?.description || selectedCity.description}
                      </p>
                    )}
                    
                    <h4 className="text-xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-2">
                      Best Places & Hotels
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </h4>
                    
                    <div className="space-y-6">
                      {loadingPlaces ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                          <Loader2 className="w-8 h-8 text-gold animate-spin mb-4" />
                          <p className="text-slate-500 font-medium">Fetching real-time recommendations...</p>
                          <p className="text-[10px] text-slate-400 mt-1">Powered by Google Search & AI</p>
                        </div>
                      ) : dynamicPlaces.length > 0 ? (
                        dynamicPlaces.map(place => (
                          <motion.div 
                            key={place.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-red-200 transition-all group"
                          >
                            <div className="w-32 h-32 shrink-0 rounded-2xl overflow-hidden">
                              <SmartImage 
                                src={place.image} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                alt={place.name} 
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-bold text-slate-900">{place.name}</h5>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${
                                  place.category === 'Hotel' ? 'bg-cedar/10 text-cedar' :
                                  place.category === 'Restaurant' ? 'bg-amber-50 text-amber-600' :
                                  'bg-gold/10 text-gold'
                                }`}>
                                  {place.category}
                                </span>
                              </div>
                              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{place.description}</p>
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-900">${place.price}</span>
                                <button 
                                  onClick={() => handleAddReservation(selectedCity, place)}
                                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-gold transition-all"
                                >
                                  <ShoppingCart className="w-4 h-4" />
                                  Reserve
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : selectedCity.places && selectedCity.places.length > 0 ? (
                        selectedCity.places.map(place => (
                          <div key={place.id} className="flex gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-red-200 transition-all group">
                            <div className="w-32 h-32 shrink-0 rounded-2xl overflow-hidden">
                              <SmartImage src={place.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={place.name} />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-bold text-slate-900">{place.name}</h5>
                                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg uppercase tracking-wider">
                                  {place.category}
                                </span>
                              </div>
                              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{place.description}</p>
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-900">${place.price}</span>
                                <button 
                                  onClick={() => handleAddReservation(selectedCity, place)}
                                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all"
                                >
                                  <ShoppingCart className="w-4 h-4" />
                                  Add to Reservations
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 italic">No specific places listed yet for this city.</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-serif font-bold text-slate-900 mb-6">Highlights</h4>
                    {loadingDetails ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-4 bg-slate-100 rounded-full animate-pulse w-3/4" />
                        ))}
                      </div>
                    ) : (
                      <ul className="space-y-4">
                        {(dynamicCityDetails?.highlights || selectedCity.highlights).map(h => (
                          <li key={h} className="flex items-center gap-3 text-slate-600 text-sm">
                            <div className="w-2 h-2 rounded-full bg-gold" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-10 p-6 bg-gold/5 rounded-3xl border border-gold/10">
                      <h5 className="font-bold text-cedar mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Plan Your Visit
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Add this city to your roadmap to include it in your AI-generated itinerary.
                      </p>
                      <button 
                        onClick={() => {
                          roadmap.includes(selectedCity.id) 
                            ? onRemoveFromRoadmap(selectedCity.id) 
                            : onAddToRoadmap(selectedCity.id);
                        }}
                        className={`w-full mt-4 py-3 rounded-xl font-bold text-sm transition-all ${
                          roadmap.includes(selectedCity.id)
                            ? 'bg-white text-cedar border border-cedar/20'
                            : 'bg-gold text-white shadow-lg shadow-gold/20 hover:bg-cedar'
                        }`}
                      >
                        {roadmap.includes(selectedCity.id) ? 'Remove from Roadmap' : 'Add to Roadmap'}
                      </button>
                    </div>
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
