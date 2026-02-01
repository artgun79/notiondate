
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getLiveWeather = async (location: string): Promise<WeatherData> => {
  try {
    // Using Type and responseSchema as recommended for structured JSON output
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `인천 서구 혹은 사용자가 입력한 ${location}의 현재 날씨(온도, 상태, 습도)를 알려주세요.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            temp: { type: Type.NUMBER },
            condition: { type: Type.STRING },
            humidity: { type: Type.NUMBER },
            description: { type: Type.STRING }
          },
          required: ["temp", "condition"]
        }
      },
    });

    // Extract grounding chunks as required by the Google Search grounding guidelines
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = groundingChunks?.map((chunk: any) => {
      if (chunk.web) {
        return { title: chunk.web.title || '출처', uri: chunk.web.uri };
      }
      return null;
    }).filter((s): s is { title: string; uri: string } => !!(s && s.uri)) || [];

    // response.text is a property, not a method. Use try-catch for robustness.
    let data;
    try {
      data = JSON.parse(response.text || "{}");
    } catch (e) {
      console.warn("Weather data parsing failed", e);
      data = {};
    }
    
    return {
      temp: data.temp ?? 0,
      condition: data.condition ?? '알 수 없음',
      location: location,
      humidity: data.humidity,
      description: data.description,
      lastUpdated: new Date(),
      sources
    };
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    // Fallback data
    return {
      temp: 0,
      condition: '데이터 없음',
      location: location,
      lastUpdated: new Date()
    };
  }
};