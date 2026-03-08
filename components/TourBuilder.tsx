
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { POPULAR_CITIES } from '../constants';
import { City } from '../types';
import { MapPin, GripVertical, Trash2, Plus, Navigation, Clock, DollarSign, Sparkles, Map as MapIcon, Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { aiService } from '../services/aiService';

// Fix for default marker icon in Leaflet
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapUpdater: React.FC<{ center: [number, number], zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

interface SortableItemProps {
  id: string;
  city: City;
  onRemove: (id: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, city, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-4 flex items-center gap-4 group"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 text-slate-300 hover:text-gold transition-colors">
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
        <img src={city.image} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-slate-900">{city.name}</h4>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
          <MapPin className="w-3 h-3 text-gold" />
          {city.category}
        </div>
      </div>
      <button 
        onClick={() => onRemove(id)}
        className="p-3 text-slate-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export const TourBuilder: React.FC<{ roadmap: string[], onUpdateRoadmap: (ids: string[]) => void }> = ({ roadmap, onUpdateRoadmap }) => {
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([31.7917, -7.0926]);
  const [mapZoom, setMapZoom] = useState(6);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const REASSURING_MESSAGES = [
    "Consulting the desert stars for the best path...",
    "Mapping the ancient caravan routes...",
    "Analyzing the Atlas mountain passes...",
    "Calculating the fastest highways between Riads...",
    "Weaving your Moroccan odyssey together..."
  ];

  useEffect(() => {
    const cities = roadmap.map(id => POPULAR_CITIES.find(c => c.id === id)).filter((c): c is City => c !== undefined);
    setSelectedCities(cities);
    if (cities.length > 0 && cities[0].coordinates) {
      setMapCenter([cities[0].coordinates.lat, cities[0].coordinates.lng]);
      setMapZoom(7);
    }
  }, [roadmap]);

  const handleOptimize = async () => {
    if (selectedCities.length <= 1) return;
    
    setIsOptimizing(true);
    let msgIndex = 0;
    const interval = setInterval(() => {
      setLoadingMessage(REASSURING_MESSAGES[msgIndex % REASSURING_MESSAGES.length]);
      msgIndex++;
    }, 1500);
    setLoadingMessage(REASSURING_MESSAGES[0]);

    try {
      const optimizedIds = await aiService.optimizeRoute(selectedCities);
      onUpdateRoadmap(optimizedIds);
    } finally {
      clearInterval(interval);
      setIsOptimizing(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = selectedCities.findIndex(c => c.id === active.id);
      const newIndex = selectedCities.findIndex(c => c.id === over.id);
      const newOrder = arrayMove(selectedCities, oldIndex, newIndex);
      setSelectedCities(newOrder);
      onUpdateRoadmap(newOrder.map((c: City) => c.id));
    }
  };

  const handleRemoveCity = (id: string) => {
    const newOrder = selectedCities.filter(c => c.id !== id);
    setSelectedCities(newOrder);
    onUpdateRoadmap(newOrder.map(c => c.id));
  };

  const handleAddCity = (city: City) => {
    if (selectedCities.some(c => c.id === city.id)) return;
    const newOrder = [...selectedCities, city];
    setSelectedCities(newOrder);
    onUpdateRoadmap(newOrder.map(c => c.id));
  };

  const polylinePositions = selectedCities
    .map(c => c.coordinates ? [c.coordinates.lat, c.coordinates.lng] as [number, number] : null)
    .filter((pos): pos is [number, number] => pos !== null);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
        <div>
          <h2 className="text-5xl font-serif font-bold text-slate-900 mb-4">Tour Architect</h2>
          <p className="text-slate-600 max-w-xl">Design your perfect Moroccan odyssey. Drag to reorder, add destinations, and visualize your route in real-time.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleOptimize}
            disabled={isOptimizing || selectedCities.length <= 1}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-cedar transition-all shadow-lg shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isOptimizing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-gold" />
                Optimizing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-gold" /> Optimize Route
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOptimizing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-gold/20 border-t-gold rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-gold animate-pulse" />
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-2">Architecting Your Tour</h3>
              <p className="text-gold font-medium italic animate-pulse">{loadingMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-gold" />
              Your Itinerary
            </h3>
            
            {selectedCities.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={selectedCities.map(c => c.id)} strategy={verticalListSortingStrategy}>
                  {selectedCities.map((city) => (
                    <SortableItem key={city.id} id={city.id} city={city} onRemove={handleRemoveCity} />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-500 text-sm">Your roadmap is empty. Add cities below to start building your tour.</p>
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-slate-50">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Add</h4>
              <div className="grid grid-cols-2 gap-3">
                {POPULAR_CITIES.filter(c => !roadmap.includes(c.id)).slice(0, 4).map(city => (
                  <button
                    key={city.id}
                    onClick={() => handleAddCity(city)}
                    className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-gold/40 transition-all text-left group"
                  >
                    <Plus className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-slate-700">{city.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[40px] p-8 text-white">
            <h3 className="text-xl font-serif font-bold mb-6">Route Insights</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-white/60">Total Travel Time</span>
                </div>
                <span className="text-sm font-bold">~14.5 Hours</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm text-white/60">Estimated Fuel/Fees</span>
                </div>
                <span className="text-sm font-bold">~$180</span>
              </div>
              <div className="p-4 bg-gold/10 border border-gold/20 rounded-2xl">
                <p className="text-xs text-gold leading-relaxed">
                  <span className="font-bold">Pro Tip:</span> Reordering your route to start in Tangier and end in Agadir could save you up to 3 hours of travel time.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-slate-100 h-[700px] relative">
            <div className="absolute top-6 left-6 z-[1000] bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3">
              <MapIcon className="w-5 h-5 text-gold" />
              <span className="text-sm font-bold text-slate-900">Interactive Roadmap</span>
            </div>
            <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapUpdater center={mapCenter} zoom={mapZoom} />
              {selectedCities.map((city, idx) => (
                city.coordinates && (
                  <Marker key={city.id} position={[city.coordinates.lat, city.coordinates.lng]} icon={icon}>
                    <Popup>
                      <div className="p-2">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 rounded-full bg-gold text-white flex items-center justify-center text-[10px] font-bold">
                            {idx + 1}
                          </span>
                          <h4 className="font-bold text-slate-900">{city.name}</h4>
                        </div>
                        <img src={city.image} className="w-full h-24 object-cover rounded-lg mb-2" />
                        <p className="text-[10px] text-slate-500 line-clamp-2">{city.description}</p>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
              {polylinePositions.length > 1 && (
                <Polyline positions={polylinePositions} color="#C8A25A" weight={4} opacity={0.8} dashArray="12, 12" />
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
