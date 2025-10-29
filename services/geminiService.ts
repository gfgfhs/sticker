import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStickers = async (
  imageBase64: string,
  mimeType: string,
  style: string,
  promptText: string,
  count: number
): Promise<string[]> => {
  const fullPrompt = `Сгенерируй стикер на основе этого изображения.
Стиль: ${style}.
Промт: ${promptText}.
Стикер должен иметь толстый белый контур и прозрачный фон.
Персонаж должен быть выразительным.`;

  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: fullPrompt,
  };

  const generationPromises = Array(count).fill(0).map(() => 
    ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart, textPart]
      },
      config: {
        responseModalities: [Modality.IMAGE],
      }
    })
  );

  const responses = await Promise.all(generationPromises);

  const stickerData = responses.reduce((acc: string[], response) => {
    const imagePart = response.candidates?.[0]?.content?.parts?.find(p => !!p.inlineData);
    if (imagePart?.inlineData) {
      acc.push(imagePart.inlineData.data);
    } else {
      console.warn("API response did not contain image data for one sticker:", JSON.stringify(response, null, 2));
    }
    return acc;
  }, []);

  if (stickerData.length === 0 && count > 0) {
    console.error("All sticker generation attempts failed.");
    throw new Error('Не удалось сгенерировать ни одного стикера. Пожалуйста, попробуйте другой промт или изображение.');
  }
  
  return stickerData;
};
