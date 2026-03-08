
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardCheck, FileText, Zap, PlayCircle, Activity, BarChart, 
  Search, Filter, Plus, ChevronRight, CheckCircle2, AlertTriangle, 
  Clock, ArrowRight, Settings, Share2, Download, Users
} from 'lucide-react';

type AuditTab = 'dashboard' | 'reports' | 'plans' | 'playbooks' | 'execution' | 'monitoring' | 'logs';

import { storageService } from '../services/storageService';

export const AuditManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AuditTab>('dashboard');
  const auditLogs = storageService.getAuditLogs();

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: BarChart },
    { id: 'reports', label: 'Audit Reports', icon: FileText },
    { id: 'logs', label: 'System Logs', icon: Activity },
    { id: 'plans', label: 'Action Plans', icon: ClipboardCheck },
    { id: 'playbooks', label: 'Playbooks', icon: PlayCircle },
    { id: 'execution', label: 'Execution', icon: Zap },
    { id: 'monitoring', label: 'Monitoring', icon: Activity },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">Audit & Compliance</h2>
          <p className="text-slate-600">Manage quality standards, safety audits, and operational playbooks.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-cedar text-white rounded-xl text-sm font-bold hover:bg-gold transition-all shadow-lg shadow-cedar/20">
            <Plus className="w-4 h-4" /> New Audit
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-2xl w-fit mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AuditTab)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Total Audits', value: '124', color: 'text-blue-500', bg: 'bg-blue-50' },
                  { label: 'Compliance Rate', value: '94.2%', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                  { label: 'Pending Actions', value: '18', color: 'text-amber-500', bg: 'bg-amber-50' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="text-sm text-slate-500 mb-1">{stat.label}</div>
                    <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6">Recent Audit Activity</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Riad Safety Inspection', location: 'Marrakech', status: 'Passed', date: '2h ago' },
                    { title: 'Artisan Quality Check', location: 'Fez Souk', status: 'Flagged', date: '5h ago' },
                    { title: 'Desert Tour Protocol', location: 'Merzouga', status: 'Passed', date: 'Yesterday' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.status === 'Passed' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                          {item.status === 'Passed' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{item.title}</div>
                          <div className="text-xs text-slate-500">{item.location} • {item.date}</div>
                        </div>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-slate-600">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-900 rounded-[40px] p-8 text-white">
                <h3 className="text-xl font-serif font-bold mb-6">Compliance Score</h3>
                <div className="flex justify-center mb-8">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path className="text-white/10" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="text-gold" stroke="currentColor" strokeWidth="3" strokeDasharray="94, 100" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-black">94%</div>
                  </div>
                </div>
                <p className="text-center text-white/60 text-sm mb-8">Your platform is currently meeting 94% of Moroccan Tourism Quality Standards.</p>
                <button className="w-full py-3 bg-gold text-white rounded-xl font-bold text-sm hover:bg-white hover:text-slate-900 transition-all">
                  View Gap Analysis
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div className="relative w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search reports..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none" />
              </div>
              <div className="flex gap-2">
                <button className="p-3 bg-slate-50 rounded-xl text-slate-500"><Filter className="w-4 h-4" /></button>
                <button className="p-3 bg-slate-50 rounded-xl text-slate-500"><Download className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl hover:bg-slate-100 transition-all cursor-pointer group">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <FileText className="w-6 h-6 text-cedar" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Q1 2024 Operational Audit Report</h4>
                      <p className="text-xs text-slate-500 mt-1">Generated on Mar 05, 2024 • 12.4 MB • PDF</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                      <div className="text-xs font-bold text-emerald-600">COMPLIANT</div>
                      <div className="text-[10px] text-slate-400">Score: 98/100</div>
                    </div>
                    <button className="p-2 text-slate-400 group-hover:text-gold transition-all">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'plans' && (
          <motion.div
            key="plans"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {[1, 2].map(i => (
              <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">In Progress</div>
                  <span className="text-xs text-slate-400">Due in 4 days</span>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-4">Improve Desert Camp Sanitation</h4>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                  Following the Merzouga audit, we need to upgrade water filtration systems and implement new waste management protocols across all partner camps.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-bold">65%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-gold h-full w-[65%]" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(j => (
                      <img key={j} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Team${j}`} className="w-8 h-8 rounded-full border-2 border-white" />
                    ))}
                  </div>
                  <button className="flex items-center gap-2 text-sm font-bold text-cedar hover:text-gold transition-all">
                    View Details <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'playbooks' && (
          <motion.div
            key="playbooks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { title: 'Emergency Response', icon: Zap, color: 'text-rose-500', bg: 'bg-rose-50' },
              { title: 'VIP Guest Arrival', icon: PlayCircle, color: 'text-gold', bg: 'bg-gold/10' },
              { title: 'Artisan Onboarding', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
              { title: 'Sustainability Guide', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            ].map((playbook, i) => (
              <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                <div className={`w-14 h-14 ${playbook.bg} ${playbook.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <playbook.icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">{playbook.title}</h4>
                <p className="text-sm text-slate-500 mb-6">Standard operating procedures for {playbook.title.toLowerCase()}.</p>
                <div className="text-xs font-bold text-cedar flex items-center gap-2">
                  12 Steps • 3 Roles <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'execution' && (
          <motion.div
            key="execution"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm text-center"
          >
            <div className="w-20 h-20 bg-cedar/10 rounded-full flex items-center justify-center mx-auto mb-8 text-cedar">
              <Zap className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Execution Manager</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-10">Real-time tracking of active playbooks and operational tasks across all Moroccan regions.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                { label: 'Active Tasks', value: '42' },
                { label: 'Completed Today', value: '156' },
                { label: 'Avg. Response Time', value: '14m' },
              ].map((stat, i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                  <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'logs' && (
          <motion.div
            key="logs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">AI & System Activity Logs</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    localStorage.removeItem('morocco_journey_audit_logs');
                    window.location.reload();
                  }}
                  className="px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  Clear Logs
                </button>
              </div>
            </div>
            <div className="p-8">
              {auditLogs.length > 0 ? (
                <div className="space-y-4">
                  {auditLogs.map((log: any) => (
                    <div key={log.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        log.status === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                      }`}>
                        {log.status === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                              {log.action}
                            </span>
                            <h4 className="font-bold text-slate-900">{log.details}</h4>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                          <Users className="w-3 h-3" />
                          User ID: {log.userId || 'System'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <Activity className="w-8 h-8" />
                  </div>
                  <p className="text-slate-500 font-medium">No system activity recorded yet.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'monitoring' && (
          <motion.div
            key="monitoring"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-900 p-12 rounded-[40px] shadow-2xl text-white"
          >
            <div className="flex justify-between items-center mb-12">
              <div>
                <h3 className="text-2xl font-serif font-bold">Live Monitoring System</h3>
                <p className="text-white/40 text-sm">Real-time operational health across the kingdom.</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold animate-pulse">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                SYSTEMS NOMINAL
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'API Uptime', value: '99.99%', trend: 'stable' },
                { label: 'User Satisfaction', value: '4.8/5', trend: 'up' },
                { label: 'Booking Success', value: '98.2%', trend: 'up' },
                { label: 'Security Status', value: 'SECURE', trend: 'stable' },
              ].map((stat, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <div className="text-xs text-white/40 font-bold uppercase tracking-widest mb-2">{stat.label}</div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
