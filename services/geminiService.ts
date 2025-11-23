import { GoogleGenAI } from "@google/genai";
import { PERSONA } from "../constants";

// Keys from original configuration
const KEYS = [
  "AIzaSyAGS2gbkHgH4uRz7tvokfrYq-y_s83rPxg",
  "AIzaSyBzlry9avvn1Gvs0eLhQx15ImNcRihDfyk"
];

let currentKeyIndex = 0;

const getClient = () => {
  return new GoogleGenAI({ apiKey: KEYS[currentKeyIndex] });
};

export const sendMessageToGemini = async (
  message: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const ai = getClient();

    // Filter valid history and ensure role format matches SDK requirements
    // The SDK expects 'user' or 'model' roles, which matches our internal types
    const formattedContents = history.map(msg => ({
      role: msg.role,
      parts: msg.parts
    }));

    // Add the current user message
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction: PERSONA,
      }
    });

    if (response.text) {
      return response.text;
    }
    
    throw new Error("Empty response from AI");

  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    
    // Key rotation logic for quota or permission errors
    if ((error.toString().includes("429") || error.toString().includes("403")) && currentKeyIndex < KEYS.length - 1) {
       console.log("Switching API Key...");
       currentKeyIndex++;
       // Recursive retry with new key
       return sendMessageToGemini(message, history);
    }

    throw new Error("SYSTEM FAILURE: Neural link severed. Unable to process request.");
  }
};
