
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  prompt?: string;
  fallbackType?: 'landscape' | 'portrait' | 'square';
}

export const SmartImage: React.FC<SmartImageProps> = ({ 
  src, 
  alt, 
  prompt, 
  fallbackType = 'landscape',
  className,
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src || src.includes('placeholder') || src === '') {
      generateImage();
    } else {
      setImgSrc(src);
    }
  }, [src]);

  const generateImage = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const finalPrompt = prompt || `A beautiful high-quality professional photograph of ${alt || 'Moroccan scenery'}, vibrant colors, travel photography style`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: finalPrompt }],
        },
        config: {
          // @ts-ignore
          imageConfig: {
            aspectRatio: fallbackType === 'landscape' ? "16:9" : fallbackType === 'portrait' ? "9:16" : "1:1",
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          setImgSrc(`data:image/png;base64,${base64Data}`);
          setLoading(false);
          return;
        }
      }
      throw new Error('No image generated');
    } catch (err) {
      console.error('Failed to generate image:', err);
      setError(true);
      // Fallback to picsum if generation fails
      setImgSrc(`https://picsum.photos/seed/${alt || 'morocco'}/800/600`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-slate-100 animate-pulse flex items-center justify-center ${className}`}>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Generating...</div>
      </div>
    );
  }

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className}
      onError={() => {
        if (!error) generateImage();
      }}
      referrerPolicy="no-referrer"
      {...props} 
    />
  );
};
