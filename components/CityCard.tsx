
import React, { useState, useEffect } from 'react';
import { City, User } from '../types';
import { Heart, MapPin } from 'lucide-react';
import { storageService } from '../services/storageService';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface CityCardProps {
  city: City;
  onClick: () => void;
}

export const CityCard: React.FC<CityCardProps> = ({ city, onClick }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const user = storageService.getCurrentUser();
    setCurrentUser(user);
    if (user && user.favorites) {
      setIsFavorite(user.favorites.includes(city.id));
    }
  }, [city.id]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      alert('Please sign in to save favorites');
      return;
    }
    storageService.toggleFavorite(currentUser.id, city.id);
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
      <MapContainer 
        center={[city.coordinates.lat, city.coordinates.lng]} 
        zoom={12} 
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        attributionControl={false}
        className="absolute inset-0 z-0"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[city.coordinates.lat, city.coordinates.lng]} icon={icon} />
      </MapContainer>

      <div 
        onClick={onClick}
        className="relative z-10 h-full w-full cursor-pointer flex flex-col justify-end"
      >
        <button 
          onClick={handleToggleFavorite}
          className={`absolute top-4 right-4 z-20 p-2 rounded-full backdrop-blur-md transition-all ${
            isFavorite ? 'bg-marrakech text-white' : 'bg-white/20 text-white hover:bg-white/40'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity z-10" />
        
        <div className="relative z-20 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            {city.category && (
              <span className="text-[10px] uppercase font-bold bg-gold px-2 py-0.5 rounded">
                {city.category}
              </span>
            )}
            {city.budget && (
              <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded">
                {city.budget}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold mb-1 font-serif">{city.name}</h3>
          <p className="text-sm opacity-90 line-clamp-2 mb-3 leading-relaxed">
            {city.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {city.highlights.slice(0, 2).map((h) => (
              <span key={h} className="text-[10px] uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-1 rounded">
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
