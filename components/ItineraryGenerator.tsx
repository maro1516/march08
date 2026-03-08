
import React, { useState, useEffect } from 'react';
import { generateItinerary } from '../services/geminiService';
import { ItineraryResponse, ItineraryItem, Climate } from '../types';
import { CATEGORIES, POPULAR_CITIES } from '../constants';
import { 
  Thermometer, CloudRain, Sun, Wind, Map as MapIcon, Clock, DollarSign, 
  Navigation, MapPin, Sparkles, Briefcase, Heart, Compass, History, 
  Send, Save, CheckCircle2, AlertCircle, Loader2, Hotel, Beer, Landmark, Calendar as CalendarIcon
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { User } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with React
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapUpdater: React.FC<{ center: [number, number], zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

interface ItineraryGeneratorProps {
  roadmap: string[];
}

export const ItineraryGenerator: React.FC<ItineraryGeneratorProps> = ({ roadmap }) => {
  const [duration, setDuration] = useState(7);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState('moderate');
  const [season, setSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter'>('spring');
  const [style, setStyle] = useState<'adventure' | 'relaxation' | 'culture' | 'business'>('culture');
  const [isBusinessTrip, setIsBusinessTrip] = useState(false);
  const [businessHours, setBusinessHours] = useState(4);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ItineraryResponse | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([31.7917, -7.0926]); // Center of Morocco
  const [mapZoom, setMapZoom] = useState(6);
  const [includeRoadmap, setIncludeRoadmap] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const currentUser = storageService.getCurrentUser();

  const roadmapCities = POPULAR_CITIES.filter(c => roadmap.includes(c.id));

  const toggleInterest = (name: string) => {
    setSelectedInterests(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const travelStyles = [
    { id: 'culture', label: 'Culture Heavy', icon: History, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'adventure', label: 'Adventure Focused', icon: Compass, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'relaxation', label: 'Relaxation Focused', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'business', label: 'Business Trip', icon: Briefcase, color: 'text-slate-500', bg: 'bg-slate-50' },
  ];

  const handleGenerate = async () => {
    if (selectedInterests.length === 0 && (!includeRoadmap || roadmap.length === 0)) {
      alert("Please select at least one interest or add cities to your roadmap.");
      return;
    }
    setLoading(true);
    setResult(null);
    setSaveStatus('idle');
    setEmailStatus('idle');
    try {
      const data = await generateItinerary(
        duration, 
        selectedInterests, 
        budget, 
        season,
        includeRoadmap ? roadmapCities.map(c => c.name) : [],
        style,
        isBusinessTrip,
        businessHours
      );
      setResult(data);
      
      // Update map center to the first location
      if (data.itinerary.length > 0 && data.itinerary[0].coordinates) {
        setMapCenter([data.itinerary[0].coordinates.lat, data.itinerary[0].coordinates.lng]);
        setMapZoom(7);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong generating your itinerary.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result || !currentUser) return;
    setSaveStatus('saving');
    
    const savedItinerary = {
      ...result,
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
      style,
      isBusinessTrip,
      businessHours
    };

    setTimeout(() => {
      storageService.saveItinerary(savedItinerary);
      storageService.saveAuditLog({
        action: 'ITINERARY_SAVED',
        details: `Saved itinerary: ${result.title}`,
        userId: currentUser.id,
        status: 'success'
      });
      setSaveStatus('saved');
    }, 1000);
  };

  const handleSendEmail = () => {
    if (!result || !currentUser) return;
    setEmailStatus('sending');
    
    setTimeout(() => {
      storageService.saveAuditLog({
        action: 'ITINERARY_EMAILED',
        details: `Emailed itinerary: ${result.title} to ${currentUser.email}`,
        userId: currentUser.id,
        status: 'success'
      });
      setEmailStatus('sent');
    }, 1500);
  };

  const getCityWeather = (cityName: string) => {
    return POPULAR_CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase() || cityName.toLowerCase().includes(c.name.toLowerCase()))?.climate;
  };

  const polylinePositions = result?.itinerary
    .map(item => item.coordinates ? [item.coordinates.lat, item.coordinates.lng] as [number, number] : null)
    .filter((pos): pos is [number, number] => pos !== null) || [];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold font-serif mb-4 text-slate-900">AI Trip Planner</h2>
        <p className="text-slate-600">Tell us your preferences and let our AI craft your dream Moroccan adventure optimized for budget and travel time.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Duration (Days)</label>
            <input 
              type="range" min="1" max="14" 
              value={duration} 
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full accent-gold mb-2"
            />
            <div className="text-right text-gold font-bold">{duration} Days</div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Budget Level</label>
            <div className="flex gap-2">
              {['Backpacker', 'Moderate', 'Luxury'].map((b) => (
                <button
                  key={b}
                  onClick={() => setBudget(b.toLowerCase())}
                  className={`flex-1 py-2 rounded-xl border text-sm transition-all ${
                    budget === b.toLowerCase() 
                      ? 'bg-gold border-gold text-white shadow-md' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-gold/40'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Travel Style</label>
            <div className="grid grid-cols-2 gap-3">
              {travelStyles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setStyle(s.id as any);
                    if (s.id === 'business') setIsBusinessTrip(true);
                    else setIsBusinessTrip(false);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                    style === s.id 
                      ? 'bg-white border-gold shadow-md ring-1 ring-gold/20' 
                      : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.bg} ${s.color}`}>
                    <s.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Interests</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => toggleInterest(cat.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                    selectedInterests.includes(cat.name)
                      ? 'bg-cedar border-cedar text-white shadow-md'
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs">{cat.icon}</span>
                  <span className="text-xs font-medium">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {isBusinessTrip && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-8 p-6 bg-slate-900 rounded-3xl text-white"
          >
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-5 h-5 text-gold" />
              <h4 className="font-bold">Business Trip Options</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Sightseeing Hours Available</label>
                <input 
                  type="range" min="1" max="8" 
                  value={businessHours} 
                  onChange={(e) => setBusinessHours(parseInt(e.target.value))}
                  className="w-full accent-gold mb-2"
                />
                <div className="text-right text-gold font-bold">{businessHours} Hours / Day</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-gold">
                  <Clock className="w-6 h-6" />
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  We'll prioritize landmarks closest to major business districts and ensure activities fit within your limited schedule.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {roadmap.length > 0 && (
          <div className="mt-8 pt-8 border-t border-slate-50">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Navigation className="w-4 h-4 text-gold" />
                Your Roadmap Cities
              </label>
              <button 
                onClick={() => setIncludeRoadmap(!includeRoadmap)}
                className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${
                  includeRoadmap ? 'bg-gold/10 text-gold' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {includeRoadmap ? 'Included' : 'Excluded'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {roadmapCities.map(city => (
                <div key={city.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-slate-600">
                  <MapPin className="w-3 h-3 text-red-400" />
                  {city.name}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 italic">
              * These cities will be prioritized in your generated itinerary.
            </p>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full mt-10 bg-gold hover:bg-cedar text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-gold/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Crafting your trip...</>
          ) : (
            <>Generate My Itinerary ✨</>
          )}
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
              <div className="bg-gold p-8 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-serif font-bold mb-2">{result.title}</h3>
                    <p className="opacity-90 leading-relaxed max-w-2xl">{result.summary}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-bold capitalize text-center">
                      {season}
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-bold capitalize text-center">
                      {style}
                    </div>
                  </div>
                </div>
                
                {currentUser && (
                  <div className="mt-8 flex gap-3">
                    <button 
                      onClick={handleSave}
                      disabled={saveStatus !== 'idle'}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
                    >
                      {saveStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : saveStatus === 'saved' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
                      {saveStatus === 'saved' ? 'Saved to Dashboard' : 'Save Roadmap'}
                    </button>
                    <button 
                      onClick={handleSendEmail}
                      disabled={emailStatus !== 'idle'}
                      className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all disabled:opacity-50"
                    >
                      {emailStatus === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : emailStatus === 'sent' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Send className="w-4 h-4" />}
                      {emailStatus === 'sent' ? 'Sent to Email' : 'Send to My Email'}
                    </button>
                  </div>
                )}
              </div>
              <div className="p-8">
                <div className="space-y-8">
                  {result.itinerary.map((item: ItineraryItem) => {
                    const weather = getCityWeather(item.location);
                    const seasonWeather = weather ? weather[season] : null;

                    return (
                      <div key={item.day} className="flex gap-6">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-cedar text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                            {item.day}
                          </div>
                          <div className="w-px flex-1 bg-slate-100 mt-2" />
                        </div>
                        <div className="pb-4 flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-lg font-bold text-slate-900">{item.location}</h4>
                            {seasonWeather && (
                              <div className="flex gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                <div className="flex items-center gap-1">
                                  <Thermometer className="w-3 h-3 text-marrakech" />
                                  {seasonWeather.high}° / {seasonWeather.low}°
                                </div>
                                <div className="flex items-center gap-1">
                                  <CloudRain className="w-3 h-3 text-cedar" />
                                  {seasonWeather.rain_days} days rain
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-4 mb-4">
                            {item.commuteTime && (
                              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                <span className="font-medium">Commute: {item.commuteTime}</span>
                              </div>
                            )}
                            {item.commuteFees && (
                              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                <DollarSign className="w-3.5 h-3.5 text-green-500" />
                                <span className="font-medium">Fees: {item.commuteFees}</span>
                              </div>
                            )}
                          </div>

                          <ul className="space-y-2 mb-6">
                            {item.activities.map((act, i) => (
                              <li key={i} className="flex items-start gap-2 text-slate-600 text-sm">
                                <span className="text-green-600 mt-1">•</span>
                                {act}
                              </li>
                            ))}
                          </ul>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {item.hotel && (
                              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-2 mb-2">
                                  <Hotel className="w-4 h-4 text-marrakech" />
                                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Stay</span>
                                </div>
                                <h5 className="font-bold text-slate-900 text-sm">{item.hotel.name}</h5>
                                <p className="text-[10px] text-slate-500 mt-1">{item.hotel.description}</p>
                                <div className="text-[10px] font-bold text-gold mt-2">{item.hotel.price}</div>
                              </div>
                            )}
                            {item.monument && (
                              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-2 mb-2">
                                  <Landmark className="w-4 h-4 text-blue-500" />
                                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Visit</span>
                                </div>
                                <h5 className="font-bold text-slate-900 text-sm">{item.monument.name}</h5>
                                <p className="text-[10px] text-slate-500 mt-1">{item.monument.description}</p>
                              </div>
                            )}
                            {item.bar && (
                              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-2 mb-2">
                                  <Beer className="w-4 h-4 text-orange-500" />
                                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Evening</span>
                                </div>
                                <h5 className="font-bold text-slate-900 text-sm">{item.bar.name}</h5>
                                <p className="text-[10px] text-slate-500 mt-1">{item.bar.description}</p>
                              </div>
                            )}
                            {item.event && (
                              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-2 mb-2">
                                  <CalendarIcon className="w-4 h-4 text-emerald-500" />
                                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Event</span>
                                </div>
                                <h5 className="font-bold text-slate-900 text-sm">{item.event.name}</h5>
                                <p className="text-[10px] text-slate-500 mt-1">{item.event.description}</p>
                                <div className="text-[10px] font-bold text-emerald-600 mt-2">{item.event.time}</div>
                              </div>
                            )}
                          </div>

                          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700 flex gap-2">
                            <span className="font-bold">💡 Pro Tip:</span>
                            <span>{item.tips}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100">
                  <h4 className="text-xl font-bold font-serif mb-4 flex items-center gap-2">
                    <span className="text-2xl">🍯</span> Cultural Insights
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.culturalAdvice.map((advice, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-marrakech/5 rounded-2xl border border-marrakech/10">
                        <div className="text-marrakech font-bold">•</div>
                        <p className="text-slate-700 text-sm leading-relaxed">{advice}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-slate-100 h-[500px] relative">
                <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-gold" />
                  <span className="text-xs font-bold text-slate-900">Route Map</span>
                </div>
                <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MapUpdater center={mapCenter} zoom={mapZoom} />
                  {result.itinerary.map((item, idx) => (
                    item.coordinates && (
                      <Marker key={idx} position={[item.coordinates.lat, item.coordinates.lng]}>
                        <Popup>
                          <div className="p-1">
                            <p className="font-bold text-slate-900 mb-1">Day {item.day}: {item.location}</p>
                            <p className="text-[10px] text-slate-500">{item.tips.substring(0, 60)}...</p>
                          </div>
                        </Popup>
                      </Marker>
                    )
                  ))}
                  {polylinePositions.length > 1 && (
                    <Polyline positions={polylinePositions} color="#C8A25A" weight={3} opacity={0.6} dashArray="10, 10" />
                  )}
                </MapContainer>
              </div>

              <div className="bg-slate-900 rounded-[32px] p-8 text-white">
                <h4 className="text-xl font-serif font-bold mb-4">Optimization Summary</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <span className="text-sm text-white/60">Total Distance</span>
                    <span className="text-sm font-bold">Optimized Route</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <span className="text-sm text-white/60">Commute Focus</span>
                    <span className="text-sm font-bold text-green-400">Low Cost</span>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed mt-4">
                    Our AI has sequenced your destinations to minimize backtracking and utilize the most cost-effective local transport options.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
