
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HERO_IMAGES } from '../constants';
import { SmartImage } from './SmartImage';

export const HeroCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <SmartImage 
            src={HERO_IMAGES[current].url} 
            className="w-full h-full object-cover scale-105" 
            alt={HERO_IMAGES[current].title} 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={`hero-text-${current}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-9xl font-serif font-extrabold text-white mb-4 drop-shadow-2xl">
              {HERO_IMAGES[current].title}
            </h1>
            <p className="text-xl md:text-3xl text-white/90 font-light max-w-2xl mx-auto drop-shadow-lg">
              {HERO_IMAGES[current].subtitle}
            </p>
            <div className="mt-12 flex gap-4 justify-center">
              <button className="px-10 py-4 bg-gold hover:bg-cedar text-white rounded-full font-bold shadow-2xl transition-all hover:scale-105">
                Explore Now
              </button>
              <button className="px-10 py-4 glass-effect text-white rounded-full font-bold transition-all hover:bg-white/20">
                Watch Film
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-10 left-10 flex gap-2">
        {HERO_IMAGES.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all duration-500 ${current === i ? 'w-12 bg-white' : 'w-4 bg-white/30'}`}
          />
        ))}
      </div>
    </section>
  );
};
