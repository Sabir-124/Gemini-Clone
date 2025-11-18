import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import { model } from "../Component Factory/AiModelModal";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({
  apiKey: apiKey,
});

interface Message {
  role: "user" | "model";
  parts: string;
}

let chatSession: any = null;

const initializeChat = (history: Message[] = []) => {
  chatSession = ai.chats.create({
    model: `gemini-2.5-${model}`,
    history: history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.parts }],
    })),
  });
};

// Wait for file to be in ACTIVE state
const waitForFileActive = async (
  fileName: string,
  maxAttempts = 30
): Promise<void> => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const fileInfo = await ai.files.get({ name: fileName });

      if (fileInfo.state === "FAILED") {
        throw new Error(`File processing failed: ${fileName}`);
      }

      // Wait 2 seconds before checking again
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Error checking file status (attempt ${i + 1}):`, error);
      if (i === maxAttempts - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  throw new Error("File processing timeout - file did not become active");
};

export const fetchAIResponse = async (prompt: string, image?: File | null) => {
  try {
    if (!chatSession) {
      initializeChat();
    }

    let message;

    if (image) {
      const file = await ai.files.upload({
        file: image,
      });

      if (!file.uri || !file.mimeType || !file.name) {
        throw new Error("File upload failed: Missing URI, MIME type, or name");
      }

      // Wait for file to be processed (especially important for videos and large files)
      await waitForFileActive(file.name);

      message = createUserContent([
        prompt,
        createPartFromUri(file.uri, file.mimeType),
      ]);
    } else {
      message = prompt;
    }

    const response = await chatSession.sendMessageStream({
      message: message,
    });

    let fullText = "";
    for await (const chunk of response) {
      fullText += chunk.text;
    }

    return fullText;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
