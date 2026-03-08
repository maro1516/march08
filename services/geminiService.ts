
import { GoogleGenAI, Type } from "@google/genai";
import { ItineraryResponse } from "../types";
import { POPULAR_CITIES } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generateItinerary(
  duration: number,
  interests: string[],
  budget: string,
  season: string,
  roadmapCities: string[] = [],
  style: string = 'culture',
  isBusinessTrip: boolean = false,
  businessHours: number = 24
): Promise<ItineraryResponse> {
  const citiesContext = POPULAR_CITIES.map(c => ({
    name: c.name,
    category: c.category,
    coordinates: c.coordinates,
    highlights: c.highlights
  }));

  const roadmapText = roadmapCities.length > 0 
    ? `The traveler specifically wants to visit these cities: ${roadmapCities.join(", ")}. Please ensure these are included in the itinerary.`
    : "";

  const styleText = `The travel style is ${style}-focused. 
    - If 'adventure-focused': prioritize trekking, desert activities, and physical challenges.
    - If 'relaxation-focused': prioritize spas, hammams, quiet Riads, and slow-paced exploration.
    - If 'culture-heavy': prioritize museums, historical sites, workshops, and deep dives into local traditions.
    - If 'business': the traveler is on a business trip.`;

  const businessText = isBusinessTrip 
    ? `IMPORTANT: This is a business trip. The traveler only has ${businessHours} hours available for sightseeing per day. Keep the itinerary very compact and focused on the most iconic spots near their likely business hubs.`
    : "";

  const prompt = `Create a detailed ${duration}-day travel itinerary for Morocco during the ${season} season, focusing on ${interests.join(", ")} with a ${budget} budget. 
  
  ${styleText}
  ${businessText}
  ${roadmapText}
  
  Context of available destinations: ${JSON.stringify(citiesContext)}
  
  IMPORTANT: 
  1. Optimize the schedule to MINIMIZE commute time and fees between locations.
  2. For each day, provide the estimated commute time and fees from the previous location (or within the city).
  3. Provide the geographic coordinates (lat, lng) for each day's main location.
  4. Include specific activities for each day, travel tips, and cultural advice.
  5. For each day, suggest:
     - A 'hotel' (name, description, estimated price).
     - A 'bar' or lounge (name, description).
     - A 'monument' or landmark (name, description).
     - An 'event' or specific timed activity (name, description, time).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          itinerary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                location: { type: Type.STRING },
                activities: { type: Type.ARRAY, items: { type: Type.STRING } },
                tips: { type: Type.STRING },
                commuteTime: { type: Type.STRING, description: "Estimated time spent traveling to/within this location" },
                commuteFees: { type: Type.STRING, description: "Estimated cost of transportation for this day" },
                coordinates: {
                  type: Type.OBJECT,
                  properties: {
                    lat: { type: Type.NUMBER },
                    lng: { type: Type.NUMBER }
                  },
                  required: ["lat", "lng"]
                },
                hotel: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    price: { type: Type.STRING }
                  }
                },
                bar: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING }
                  }
                },
                monument: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING }
                  }
                },
                event: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    time: { type: Type.STRING }
                  }
                }
              },
              required: ["day", "location", "activities", "tips", "coordinates"],
            },
          },
          culturalAdvice: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["title", "summary", "itinerary", "culturalAdvice"],
      },
    },
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Failed to parse itinerary:", error);
    throw new Error("Could not generate a valid itinerary.");
  }
}

export async function askMoroccoAssistant(question: string, history: any[]) {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are an expert Morocco travel guide. You are helpful, knowledgeable about Moroccan culture, food, geography, and history. Answer questions concisely but warmly. If asked about news, use the googleSearch tool to provide current info.',
      tools: [{ googleSearch: {} }]
    }
  });

  const response = await chat.sendMessage({ message: question });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.web).filter(Boolean) || []
  };
}
