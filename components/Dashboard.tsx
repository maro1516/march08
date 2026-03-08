
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { ANALYTICS_DATA, POPULAR_CITIES } from '../constants';
import { 
  TrendingUp, Users, Calendar, DollarSign, Heart, Package, Clock, MapPin,
  Bell, Share2, Award, MessageSquare, Zap, Gift, Globe
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { User as UserType, Booking, SavedItinerary } from '../types';
import { SmartImage } from './SmartImage';

interface DashboardProps {
  user?: UserType | null;
}

const NOTIFICATIONS = [
  { id: 1, title: 'Booking Confirmed', message: 'Your Riad stay in Marrakech is confirmed!', time: '2h ago', type: 'success' },
  { id: 2, title: 'New Message', message: 'Artisan Ahmed replied to your inquiry.', time: '5h ago', type: 'info' },
  { id: 3, title: 'Loyalty Reward', message: 'You just earned 500 Atlas Points!', time: '1d ago', type: 'reward' },
];

const SOCIAL_FEED = [
  { id: 1, user: 'Elena M.', action: 'shared a photo from', target: 'Chefchaouen', time: '1h ago', image: 'https://picsum.photos/seed/blue/400/300' },
  { id: 2, user: 'Marcus K.', action: 'completed the', target: 'Atlas Trek', time: '3h ago', image: 'https://picsum.photos/seed/mountain/400/300' },
];

export const Dashboard: React.FC<DashboardProps> = ({ user: propUser }) => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(propUser || null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [userItineraries, setUserItineraries] = useState<SavedItinerary[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'roadmaps' | 'favorites' | 'social' | 'rewards'>('overview');
  const [language, setLanguage] = useState<'EN' | 'FR' | 'AR'>('EN');
  
  useEffect(() => {
    const user = propUser || storageService.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setUserBookings(storageService.getUserBookings(user.id));
      setUserItineraries(storageService.getUserItineraries(user.id));
    } else {
      setUserBookings([]);
      setUserItineraries([]);
    }
  }, [propUser]);

  const stats = [
    { label: 'Total Revenue', value: '$24,850', change: '+12.5%', icon: DollarSign, color: 'text-cedar' },
    { label: 'Total Bookings', value: '1,482', change: '+8.2%', icon: Calendar, color: 'text-gold' },
    { label: 'Active Users', value: '8,320', change: '+5.4%', icon: Users, color: 'text-slate-600' },
    { label: 'Growth Rate', value: '24.3%', change: '+2.1%', icon: TrendingUp, color: 'text-marrakech' },
  ];

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-400">
          <Users className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Welcome to Your Dashboard</h2>
        <p className="text-slate-600 max-w-md mx-auto mb-10">Sign in to view your personalized travel insights, bookings, and favorite Moroccan treasures.</p>
        <div className="bg-white p-12 rounded-[40px] shadow-sm border border-slate-100 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-8">Platform Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-left">
                <div className={`p-3 rounded-2xl bg-slate-50 w-fit mb-4 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-sm text-slate-500 mb-1">{stat.label}</div>
                <div className="text-2xl font-black text-slate-900">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const favoriteCities = POPULAR_CITIES.filter(city => currentUser.favorites?.includes(city.id));

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">Salam, {currentUser.name.split(' ')[0]}!</h2>
          <p className="text-slate-600">Welcome to your personalized Morocco Journey dashboard.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['EN', 'FR', 'AR'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${language === lang ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
              >
                {lang}
              </button>
            ))}
          </div>
          <button className="relative p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-gold transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-marrakech rounded-full border-2 border-white" />
          </button>
          <div className="flex items-center gap-3 px-4 py-2 bg-gold/10 border border-gold/20 rounded-2xl">
            <Award className="w-5 h-5 text-gold" />
            <div>
              <div className="text-[10px] font-bold text-gold uppercase tracking-widest">Atlas Points</div>
              <div className="text-sm font-black text-slate-900">2,450</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit mb-10 overflow-x-auto no-scrollbar max-w-full">
        {(['overview', 'bookings', 'roadmaps', 'favorites', 'social', 'rewards'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Bookings */}
          <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold" />
                Recent Bookings
              </h3>
              <button className="text-sm font-bold text-gold hover:underline">View All</button>
            </div>
            
            {userBookings.length > 0 ? (
              <div className="space-y-4">
                {userBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm">
                        {booking.type === 'bazaar' ? '🛍️' : booking.type === 'hotel' ? '🏨' : '🐪'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{booking.itemName}</h4>
                        <p className="text-xs text-slate-500">{new Date(booking.date).toLocaleDateString()} • {booking.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">${booking.amount}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-500 mb-4">No bookings yet. Start your adventure today!</p>
                <button className="px-6 py-2 bg-gold text-white rounded-xl text-sm font-bold shadow-lg shadow-gold/20">Explore Experiences</button>
              </div>
            )}
          </section>

          {/* Favorites Section */}
          <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Heart className="w-5 h-5 text-marrakech" />
                Saved Favorites
              </h3>
            </div>
            
            {favoriteCities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteCities.map((city) => (
                  <div key={city.id} className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer">
                    <SmartImage src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                      <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                        <MapPin className="w-3 h-3" />
                        Morocco
                      </div>
                      <h4 className="text-xl font-bold text-white">{city.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-500">You haven't saved any favorites yet.</p>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-8">
          {/* Revenue Chart (Personalized if applicable, or platform-wide) */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold mb-6">Spending Analysis</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ANALYTICS_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C8A25A" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#C8A25A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#C8A25A" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-500">Total Spent</span>
                <span className="font-bold text-slate-900">${userBookings.reduce((sum, b) => sum + b.amount, 0)}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-gold h-full w-[65%]" />
              </div>
            </div>
          </div>

          {/* Travel Profile */}
          <div className="bg-slate-900 rounded-[32px] p-8 text-white">
            <h3 className="text-xl font-serif font-bold mb-6">Traveler Profile</h3>
            <div className="flex items-center gap-4 mb-8">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-16 h-16 rounded-full border-2 border-white/20" />
              <div>
                <h4 className="font-bold">{currentUser.name}</h4>
                <p className="text-xs text-white/60">{currentUser.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-sm text-white/60">Member Since</span>
                <span className="text-sm font-bold">Feb 2024</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span className="text-sm text-white/60">Loyalty Level</span>
                <span className="text-sm font-bold text-gold">Gold Explorer</span>
              </div>
            </div>
            <button className="w-full mt-8 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )}

  {activeTab === 'bookings' && (
          <motion.div
            key="bookings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100"
          >
            <h3 className="text-xl font-bold mb-8">All Bookings</h3>
            <div className="space-y-4">
              {userBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm">
                      {booking.type === 'bazaar' ? '🛍️' : booking.type === 'hotel' ? '🏨' : '🐪'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{booking.itemName}</h4>
                      <p className="text-xs text-slate-500">{new Date(booking.date).toLocaleDateString()} • {booking.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">${booking.amount}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'roadmaps' && (
          <motion.div
            key="roadmaps"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {userItineraries.length > 0 ? (
              userItineraries.map((itinerary) => (
                <div key={itinerary.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                        itinerary.style === 'adventure' ? 'bg-orange-50 text-orange-600' :
                        itinerary.style === 'relaxation' ? 'bg-rose-50 text-rose-600' :
                        itinerary.style === 'business' ? 'bg-slate-900 text-white' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {itinerary.style}
                      </div>
                      {itinerary.isBusinessTrip && (
                        <div className="px-3 py-1 bg-gold/10 text-gold rounded-lg text-[10px] font-bold uppercase tracking-widest">
                          Business
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{new Date(itinerary.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-gold transition-colors">{itinerary.title}</h4>
                  <p className="text-sm text-slate-500 mb-8 line-clamp-2">{itinerary.summary}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {itinerary.itinerary.length} Days
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {itinerary.itinerary[0].location}
                      </div>
                    </div>
                    <button className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-gold transition-all">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-24 bg-slate-50 rounded-[48px] border border-dashed border-slate-200">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Globe className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">No Roadmaps Yet</h4>
                <p className="text-slate-500 mb-8">Generate your first AI itinerary to see it here.</p>
                <button className="px-8 py-3 bg-gold text-white rounded-2xl font-bold shadow-lg shadow-gold/20">Plan a Trip</button>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'favorites' && (
          <motion.div
            key="favorites"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {favoriteCities.map((city) => (
              <div key={city.id} className="group relative h-64 rounded-[32px] overflow-hidden cursor-pointer">
                <SmartImage src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                  <h4 className="text-2xl font-bold text-white">{city.name}</h4>
                  <p className="text-white/60 text-sm">Morocco</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'social' && (
          <motion.div
            key="social"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-6">
              {SOCIAL_FEED.map(post => (
                <div key={post.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                        {post.user[0]}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {post.user} <span className="font-normal text-slate-500">{post.action}</span> {post.target}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{post.time}</div>
                      </div>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-gold transition-all">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                  <img src={post.image} className="w-full h-80 object-cover" />
                  <div className="p-6 flex items-center gap-6">
                    <button className="flex items-center gap-2 text-slate-500 hover:text-marrakech transition-all">
                      <Heart className="w-5 h-5" /> <span className="text-xs font-bold">124</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-500 hover:text-gold transition-all">
                      <MessageSquare className="w-5 h-5" /> <span className="text-xs font-bold">12</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-[32px] p-8 text-white">
                <h3 className="text-xl font-bold mb-6">Trending Topics</h3>
                <div className="space-y-4">
                  {['#MarrakechDesign', '#AtlasTrek', '#BerberCulture', '#MoroccanFood'].map(tag => (
                    <div key={tag} className="flex justify-between items-center group cursor-pointer">
                      <span className="text-sm text-white/60 group-hover:text-gold transition-colors">{tag}</span>
                      <span className="text-[10px] font-bold text-white/20">2.4k posts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'rewards' && (
          <motion.div
            key="rewards"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-br from-gold to-cedar p-12 rounded-[48px] text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-8 h-8" />
                  <span className="text-sm font-bold uppercase tracking-[0.2em]">Atlas Loyalty Program</span>
                </div>
                <h3 className="text-5xl font-serif font-bold mb-4">You're a Silver Explorer</h3>
                <p className="text-white/80 max-w-md mb-10">Only 550 points away from Gold status. Unlock free private tours and exclusive Riad upgrades.</p>
                <div className="flex gap-4">
                  <button className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all">
                    Redeem Points
                  </button>
                  <button className="px-8 py-3 bg-white/10 backdrop-blur-md text-white rounded-2xl font-bold text-sm hover:bg-white/20 transition-all">
                    View Benefits
                  </button>
                </div>
              </div>
              <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 opacity-10">
                <Award className="w-96 h-96" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Free Tea Ceremony', cost: '500 pts', icon: Gift },
                { title: 'Souk Guide (2h)', cost: '1200 pts', icon: Zap },
                { title: 'Riad Upgrade', cost: '2500 pts', icon: Award },
              ].map(reward => (
                <div key={reward.title} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm text-center group">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gold group-hover:scale-110 transition-transform">
                    <reward.icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{reward.title}</h4>
                  <div className="text-sm font-black text-gold mb-8">{reward.cost}</div>
                  <button className="w-full py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-900 hover:text-white transition-all">
                    Claim Reward
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
