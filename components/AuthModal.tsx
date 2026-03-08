
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';
import { auth } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { storageService } from '../services/storageService';
import { User } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'Explorer',
          role: (firebaseUser.email === 'admin@moroccosojourn.com' || firebaseUser.email?.includes('admin')) ? 'admin' : 'user',
          avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`
        };

        storageService.setCurrentUser(user);
        onSuccess(user);
        onClose();
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        await updateProfile(firebaseUser, {
          displayName: name,
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        });

        const newUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: name,
          role: (firebaseUser.email === 'admin@moroccosojourn.com' || firebaseUser.email?.includes('admin')) ? 'admin' : 'user',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        };

        storageService.setCurrentUser(newUser);
        onSuccess(newUser);
        onClose();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email already exists');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="p-8 md:p-12">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 gradient-morocco rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg mx-auto mb-6">
              🇲🇦
            </div>
            <h2 className="text-3xl font-bold font-serif text-slate-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Join the Journey'}
            </h2>
            <p className="text-slate-500">
              {isLogin ? 'Sign in to access your saved trips' : 'Create an account to start planning'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm font-medium px-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-red-600 font-bold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
