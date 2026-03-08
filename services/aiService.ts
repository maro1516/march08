
import { GoogleGenAI, Type } from "@google/genai";
import { City } from "../types";
import { storageService } from "./storageService";

export const aiService = {
  optimizeRoute: async (cities: City[]): Promise<string[]> => {
    if (cities.length <= 1) return cities.map(c => c.id);

    const currentUser = storageService.getCurrentUser();
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const cityData = cities.map(c => ({
      id: c.id,
      name: c.name,
      coords: c.coordinates
    }));

    const prompt = `
      You are a Moroccan travel logistics expert. 
      I have a list of cities for a tour: ${JSON.stringify(cityData)}.
      
      Tasks:
      1. Analyze the geographic coordinates (lat/lng) of these cities.
      2. Determine the most efficient travel sequence to minimize total driving time.
      3. Return ONLY a JSON array of the city IDs in the optimized order.
      
      Constraints:
      - Use real-world Moroccan road network logic (e.g., highways between major cities).
      - Do not include any text other than the JSON array.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      const result = JSON.parse(response.text || "[]");
      
      // Validation: Ensure all original IDs are present in the result
      const originalIds = cities.map(c => c.id);
      const isValid = result.every((id: string) => originalIds.includes(id)) && result.length === originalIds.length;
      
      storageService.saveAuditLog({
        action: 'ROUTE_OPTIMIZATION',
        details: `Optimized route with ${cities.length} cities. Result: ${result.join(' -> ')}`,
        userId: currentUser?.id,
        status: isValid ? 'success' : 'failure'
      });

      return isValid ? result : originalIds;
    } catch (error) {
      console.error("AI Optimization failed:", error);
      storageService.saveAuditLog({
        action: 'ROUTE_OPTIMIZATION',
        details: `Failed to optimize route: ${error instanceof Error ? error.message : 'Unknown error'}`,
        userId: currentUser?.id,
        status: 'failure'
      });
      return cities.map(c => c.id);
    }
  }
};
