
import { GoogleGenAI, Type } from "@google/genai";
import { Place, City } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function fetchCityPlaces(cityName: string): Promise<Place[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Find the best places to visit and top-rated hotels in ${cityName}, Morocco. 
    Include a mix of Activities, Hotels, and Restaurants.
    For each place, provide:
    - name
    - a short description
    - an estimated price in USD (just a number)
    - category (Activity, Hotel, or Restaurant)
    - a relevant high-quality image URL from Unsplash or similar (if possible, otherwise use a placeholder like https://picsum.photos/seed/place/600/400)`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            price: { type: Type.NUMBER },
            category: { type: Type.STRING, enum: ["Activity", "Hotel", "Restaurant"] },
            image: { type: Type.STRING }
          },
          required: ["name", "description", "price", "category", "image"]
        }
      }
    }
  });

  try {
    const places = JSON.parse(response.text || "[]");
    return places.map((p: any, index: number) => ({
      ...p,
      id: `dynamic-${cityName}-${index}`
    }));
  } catch (error) {
    console.error("Error parsing dynamic places:", error);
    return [];
  }
}

export async function fetchCityDetails(cityName: string): Promise<Partial<City>> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide detailed information about the city of ${cityName}, Morocco. 
    Include:
    - A compelling description
    - 5 key highlights (must-see spots)
    - 3-5 tags (e.g., Culture, History, Beach)
    - Current budget level ($, $$, or $$$)`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          budget: { type: Type.STRING }
        },
        required: ["description", "highlights", "tags", "budget"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error parsing dynamic city details:", error);
    return {};
  }
}

export async function searchCities(query: string): Promise<Partial<City>[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Find 3-5 cities in Morocco that match the search query: "${query}". 
    For each city, provide:
    - name
    - a very short description (1 sentence)
    - category (e.g., Coastal, Imperial, Desert)
    - a relevant high-quality image URL from Unsplash
    - coordinates (lat, lng)`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            image: { type: Type.STRING },
            coordinates: {
              type: Type.OBJECT,
              properties: {
                lat: { type: Type.NUMBER },
                lng: { type: Type.NUMBER }
              },
              required: ["lat", "lng"]
            }
          },
          required: ["name", "description", "category", "image", "coordinates"]
        }
      }
    }
  });

  try {
    const cities = JSON.parse(response.text || "[]");
    return cities.map((c: any) => ({
      ...c,
      id: `search-${c.name.toLowerCase().replace(/\s+/g, '-')}`,
      highlights: [], // Will be fetched on detail view
      tags: []
    }));
  } catch (error) {
    console.error("Error parsing search results:", error);
    return [];
  }
}
