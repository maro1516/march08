
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { POPULAR_CITIES } from './constants';
import { CityCard } from './components/CityCard';
import { ItineraryGenerator } from './components/ItineraryGenerator';
import { ChatWidget } from './components/ChatWidget';
import { HeroCarousel } from './components/HeroCarousel';
import { BazaarSection } from './components/BazaarSection';
import { Dashboard } from './components/Dashboard';
import { BookingModal } from './components/BookingModal';
import { AuthModal } from './components/AuthModal';
import { Destinations } from './components/Destinations';
import { ReservationBasket } from './components/ReservationBasket';
import { useRoadmap } from './hooks/useRoadmap';
import { useReservations } from './hooks/useReservations';
import { storageService } from './services/storageService';
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { User } from './types';
import { 
  Map, ShoppingBag, PieChart, Plane, Compass, LogOut, User as UserIcon, 
  ShieldAlert, ClipboardCheck, Map as MapIcon, Sparkles, ArrowRight, Star
} from 'lucide-react';
import { SmartImage } from './components/SmartImage';

type Tab = 'home' | 'destinations' | 'planner' | 'bazaar' | 'dashboard' | 'admin' | 'audit' | 'builder';

import { AdminDashboard } from './components/AdminDashboard';
import { AuditManagement } from './components/AuditManagement';
import { BrowseStalls } from './components/BrowseStalls';
import { TourBuilder } from './components/TourBuilder';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedBookingItem, setSelectedBookingItem] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const { roadmap, setRoadmap, addToRoadmap, removeFromRoadmap } = useRoadmap();
  const { reservations, addToReservations, removeFromReservations, clearReservations } = useReservations();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'Explorer',
          role: (firebaseUser.email === 'admin@moroccosojourn.com' || firebaseUser.email?.includes('admin')) ? 'admin' : 'user',
          avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`
        };
        setCurrentUser(user);
        storageService.setCurrentUser(user);
      } else {
        setCurrentUser(null);
        storageService.setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsUserMenuOpen(false);
      setActiveTab('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { id: 'home', label: 'Explore', icon: Compass },
    { id: 'destinations', label: 'Destinations', icon: Map },
    { id: 'planner', label: 'Trip Planner', icon: Plane },
    { id: 'builder', label: 'Tour Architect', icon: MapIcon },
    { id: 'bazaar', label: 'Grand Bazaar', icon: ShoppingBag },
    { id: 'dashboard', label: 'Dashboard', icon: PieChart },
    ...(currentUser?.role === 'admin' ? [
      { id: 'admin', label: 'Admin', icon: ShieldAlert },
      { id: 'audit', label: 'Audit', icon: ClipboardCheck }
    ] : [])
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div key="home-content">
            <HeroCarousel />
            
            <section className="max-w-7xl mx-auto px-6 py-24">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-4xl font-bold font-serif text-slate-900 mb-2">Iconic Destinations</h2>
                  <p className="text-slate-600">The most beloved cities in the kingdom.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {POPULAR_CITIES.map((city) => (
                  <CityCard key={city.id} city={city} onClick={() => {}} />
                ))}
              </div>
            </section>

            {/* AI Recommendations Section */}
            <section className="max-w-7xl mx-auto px-6 py-24">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <div className="flex items-center gap-2 text-gold font-bold text-sm uppercase tracking-widest mb-2">
                    <Sparkles className="w-4 h-4" />
                    AI Personalized
                  </div>
                  <h2 className="text-4xl font-serif font-bold text-slate-900">Recommended for You</h2>
                </div>
                <button className="text-sm font-bold text-slate-400 hover:text-gold transition-colors flex items-center gap-2">
                  View All Insights <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: 'Hidden Gems of Chefchaouen', category: 'Photography', rating: 4.9, image: 'https://picsum.photos/seed/blue/800/600' },
                  { title: 'Private Atlas Cooking Class', category: 'Gastronomy', rating: 5.0, image: 'https://picsum.photos/seed/food/800/600' },
                  { title: 'Sunset Camel Trek', category: 'Adventure', rating: 4.8, image: 'https://picsum.photos/seed/desert/800/600' },
                ].map((rec, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -10 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative h-80 rounded-[40px] overflow-hidden mb-6 shadow-lg">
                      <SmartImage src={rec.image} alt={rec.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-6 left-6 px-4 py-2 bg-white/20 backdrop-blur-md rounded-2xl text-white text-[10px] font-bold uppercase tracking-widest">
                        {rec.category}
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 mb-1">{rec.title}</h4>
                        <div className="flex items-center gap-1 text-gold">
                          <Star className="w-3 h-3 fill-gold" />
                          <span className="text-xs font-bold">{rec.rating}</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-gold group-hover:text-white group-hover:border-gold transition-all">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="bg-slate-900 py-24 px-6 overflow-hidden relative">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-4xl md:text-6xl font-bold font-serif text-white mb-6">Traditional Luxury</h2>
                  <p className="text-slate-400 text-xl leading-relaxed mb-8 font-light">
                    Experience the legendary Moroccan hospitality in a Riad – traditional houses converted into boutique guesthouses.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {['Intricate Architecture', 'Mint Tea Ceremonies', 'Andalusian Gardens', 'Secret Rooftops'].map(f => (
                      <div key={f} className="flex items-center gap-3 text-white/80 p-4 bg-white/5 rounded-2xl">
                        <div className="w-6 h-6 rounded-full bg-green-700 flex items-center justify-center text-[10px]">✓</div>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <SmartImage src="https://images.unsplash.com/photo-1510252118317-06399121a7df?auto=format&fit=crop&q=80&w=1000" className="rounded-[40px] shadow-2xl h-[500px] w-full object-cover" alt="Riad" />
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="absolute -bottom-10 -left-10 glass-effect p-8 rounded-3xl shadow-2xl max-w-[280px]"
                  >
                    <div className="text-4xl mb-4">🍲</div>
                    <div className="font-bold text-2xl text-slate-900">Taste the Souks</div>
                    <p className="text-slate-600 mt-2">AI curated food tours across Marrakech and Fez.</p>
                    <button className="mt-6 text-red-600 font-bold hover:underline">Explore Menus →</button>
                  </motion.div>
                </div>
              </div>
            </section>
          </div>
        );
      case 'planner':
        return <ItineraryGenerator key="planner-content" roadmap={roadmap} />;
      case 'destinations':
        return (
          <Destinations 
            key="destinations-content" 
            roadmap={roadmap} 
            onAddToRoadmap={addToRoadmap} 
            onRemoveFromRoadmap={removeFromRoadmap} 
            onAddToReservations={addToReservations}
          />
        );
      case 'bazaar':
        return <BrowseStalls key="bazaar-content" onBook={setSelectedBookingItem} />;
      case 'dashboard':
        return <Dashboard key="dashboard-content" user={currentUser} />;
      case 'builder':
        return <TourBuilder key="builder-content" roadmap={roadmap} onUpdateRoadmap={setRoadmap} />;
      case 'admin':
        return <AdminDashboard key="admin-content" />;
      case 'audit':
        return <AuditManagement key="audit-content" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-ivoire zellige-pattern">
      <AnimatePresence>
        {selectedBookingItem && (
          <BookingModal 
            key="booking-modal"
            item={selectedBookingItem} 
            onClose={() => setSelectedBookingItem(null)} 
          />
        )}
        {isAuthModalOpen && (
          <AuthModal 
            key="auth-modal"
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={(user) => setCurrentUser(user)}
          />
        )}
      </AnimatePresence>

      <ReservationBasket 
        isOpen={isBasketOpen}
        onClose={() => setIsBasketOpen(false)}
        reservations={reservations}
        onRemove={removeFromReservations}
        onClear={clearReservations}
      />

      <nav className="fixed top-0 w-full z-40 glass-effect border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="flex flex-col -space-y-2">
              <span className="text-sm font-bold tracking-[0.2em] text-cedar uppercase">Morocco</span>
              <span className="text-4xl font-script text-gold">Sojourn</span>
            </div>
            <div className="w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full text-gold fill-current">
                <path d="M50 0 L60 35 L95 35 L65 55 L75 90 L50 70 L25 90 L35 55 L5 35 L40 35 Z" />
                <circle cx="50" cy="50" r="10" className="text-ivoire fill-current" />
              </svg>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-2">
              {navItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id as Tab)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                    activeTab === item.id 
                      ? 'bg-gold text-white shadow-lg' 
                      : 'text-slate-500 hover:text-cedar hover:bg-white/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="h-8 w-px bg-slate-200"></div>

            <button 
              onClick={() => setIsBasketOpen(true)}
              className="relative p-2 text-slate-500 hover:text-gold transition-all"
            >
              <ShoppingBag className="w-6 h-6" />
              {reservations.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-marrakech text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {reservations.length}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-100 transition-all"
                >
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-slate-900 leading-none">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Explorer</p>
                  </div>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50"
                    >
                      <button 
                        onClick={() => {
                          setActiveTab('dashboard');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                      >
                        <UserIcon className="w-4 h-4" />
                        My Profile
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-16 px-6 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex flex-col -space-y-1">
                <span className="text-[10px] font-bold tracking-[0.2em] text-cedar uppercase">Morocco</span>
                <span className="text-2xl font-script text-gold">Sojourn</span>
              </div>
            </div>
            <p className="text-slate-500 max-w-sm mb-8">
              Empowering local artisans and explorers through smart, AI-driven tourism experiences in the heart of North Africa.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center hover:bg-gold hover:text-white transition-colors cursor-pointer text-xs font-bold">IG</div>
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center hover:bg-gold hover:text-white transition-colors cursor-pointer text-xs font-bold">TW</div>
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center hover:bg-gold hover:text-white transition-colors cursor-pointer text-xs font-bold">FB</div>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6">Explore</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li className="hover:text-gold cursor-pointer">City Guides</li>
              <li className="hover:text-gold cursor-pointer">Riad Collection</li>
              <li className="hover:text-gold cursor-pointer">Sahara Treks</li>
              <li className="hover:text-gold cursor-pointer">Cultural Events</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li className="hover:text-gold cursor-pointer">About Us</li>
              <li className="hover:text-gold cursor-pointer">Host a Stall</li>
              <li className="hover:text-gold cursor-pointer">Sustainability</li>
              <li className="hover:text-gold cursor-pointer">Support</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© 2024 MoroccoSoJourn AI. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Settings</span>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
};

export default App;
