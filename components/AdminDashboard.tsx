
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, ShieldAlert, TrendingUp, Search, Filter, 
  MoreVertical, CheckCircle2, XCircle, AlertCircle, Trash2, Edit2,
  Download, PieChart, BarChart3, ArrowUpRight, ArrowDownRight, Plus
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { User, Booking } from '../types';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell
} from 'recharts';

const ANALYTICS_DATA = [
  { name: 'Jan', revenue: 4000, bookings: 240 },
  { name: 'Feb', revenue: 3000, bookings: 198 },
  { name: 'Mar', revenue: 2000, bookings: 150 },
  { name: 'Apr', revenue: 2780, bookings: 210 },
  { name: 'May', revenue: 1890, bookings: 120 },
  { name: 'Jun', revenue: 2390, bookings: 170 },
  { name: 'Jul', revenue: 3490, bookings: 250 },
];

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'bookings' | 'disputes'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    setUsers(storageService.getUsers());
    setBookings(storageService.getBookings());
  }, []);

  const handleUpdateBooking = (id: string, status: 'confirmed' | 'cancelled') => {
    storageService.updateBooking(id, { status });
    setBookings(storageService.getBookings());
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // In a real app, we'd delete from Firebase and local storage
      const updatedUsers = users.filter(u => u.id !== id);
      setUsers(updatedUsers);
      localStorage.setItem('morocco_journey_users', JSON.stringify(updatedUsers));
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         b.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: 'Total Revenue', value: `$${storageService.getRevenue().toLocaleString()}`, change: '+12.5%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Total Users', value: users.length, change: '+5.4%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Active Bookings', value: bookings.filter(b => b.status === 'pending').length, change: '-2.1%', icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Open Disputes', value: 3, change: '+1', icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">Admin Command Center</h2>
          <p className="text-slate-600">Oversee the MoroccoSoJourn ecosystem and manage platform growth.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Download className="w-4 h-4" /> Export Data
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-cedar transition-all shadow-lg shadow-slate-900/10">
            <Plus className="w-4 h-4" /> New Announcement
          </button>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit mb-10">
        {(['overview', 'users', 'bookings', 'disputes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
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
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                  <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-sm text-slate-500 mb-1">{stat.label}</div>
                  <div className="flex items-end gap-2">
                    <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                    <div className={`text-xs font-bold mb-1 flex items-center ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {stat.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold">Revenue & Bookings</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gold" />
                      <span className="text-xs text-slate-500">Revenue</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-cedar" />
                      <span className="text-xs text-slate-500">Bookings</span>
                    </div>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ANALYTICS_DATA}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C8A25A" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#C8A25A" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#C8A25A" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                      <Area type="monotone" dataKey="bookings" stroke="#5A5A40" strokeWidth={3} fill="transparent" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold mb-8">Category Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Hotels', value: 45, color: '#C8A25A' },
                      { name: 'Activities', value: 30, color: '#5A5A40' },
                      { name: 'Bazaar', value: 25, color: '#8B4513' },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                        {[0, 1, 2].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#C8A25A', '#5A5A40', '#8B4513'][index]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-8 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Top Performing</span>
                    <span className="text-sm font-bold text-emerald-500">Luxury Riads</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Most Growth</span>
                    <span className="text-sm font-bold text-blue-500">Artisan Workshops</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search users by name or email..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-gold transition-all"
                />
              </div>
              <div className="flex gap-2">
                <button className="p-3 bg-slate-50 rounded-xl text-slate-500 hover:text-slate-700 transition-all">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                    <th className="px-8 py-4">User</th>
                    <th className="px-8 py-4">Role</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Joined</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} className="w-10 h-10 rounded-full border border-slate-100" />
                          <div>
                            <div className="font-bold text-slate-900">{user.name}</div>
                            <div className="text-xs text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          user.role === 'admin' ? 'bg-rose-50 text-rose-600' : 
                          user.role === 'artisan' ? 'bg-gold/10 text-gold' : 
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-sm text-slate-600">Active</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-500">
                        Feb 12, 2024
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-slate-400 hover:text-gold transition-all">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-slate-400 hover:text-rose-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'bookings' && (
          <motion.div
            key="bookings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex gap-2">
                {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                      filterStatus === status 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search bookings..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-gold transition-all"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                    <th className="px-8 py-4">Customer</th>
                    <th className="px-8 py-4">Item</th>
                    <th className="px-8 py-4">Amount</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="font-bold text-slate-900">{booking.customerName}</div>
                        <div className="text-xs text-slate-500">{new Date(booking.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm">
                            {booking.type === 'bazaar' ? '🛍️' : booking.type === 'hotel' ? '🏨' : '🐪'}
                          </div>
                          <div className="text-sm font-medium text-slate-700">{booking.itemName}</div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="font-bold text-slate-900">${booking.amount}</div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 
                          booking.status === 'pending' ? 'bg-amber-50 text-amber-600' : 
                          'bg-rose-50 text-rose-600'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {booking.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleUpdateBooking(booking.id, 'confirmed')}
                              className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleUpdateBooking(booking.id, 'cancelled')}
                              className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-all"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <button className="p-2 text-slate-400 hover:text-slate-600 transition-all ml-2">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'disputes' && (
          <motion.div
            key="disputes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-rose-600 uppercase tracking-widest">High Priority</div>
                      <div className="text-sm font-bold text-slate-900">#DISP-829{i}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-1 rounded-lg uppercase">Under Review</span>
                </div>
                
                <h4 className="text-lg font-bold text-slate-900 mb-2">Refund Request: Berber Rug</h4>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  Customer claims the item received does not match the description in terms of color vibrancy and material quality.
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`} className="w-6 h-6 rounded-full" />
                    <span className="text-xs font-bold text-slate-700">Sarah J.</span>
                  </div>
                  <button className="text-xs font-bold text-gold hover:underline">Resolve Dispute →</button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
