import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { TextInput } from './components/TextInput';
import { Button } from './components/Button';
import { StickerGrid } from './components/StickerGrid';
import { Loader } from './components/Loader';
import { generateStickers } from './services/geminiService';
import { fileToBase64, getMimeType } from './utils/fileUtils';

// For JSZip loaded from CDN
declare const JSZip: any;

const App: React.FC = () => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [style, setStyle] = useState<string>('Мультяшный');
  const [promptText, setPromptText] = useState<string>('Кот в шляпе волшебника');
  const [generatedStickers, setGeneratedStickers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stickerCount, setStickerCount] = useState<number>(10);

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      setError(null);
      const base64 = await fileToBase64(file);
      const fileMimeType = getMimeType(file.name);
      if (!fileMimeType) {
        setError("Неподдерживаемый тип файла. Пожалуйста, загрузите JPEG, PNG или WEBP.");
        return;
      }
      setImageBase64(base64);
      setMimeType(fileMimeType);
    } catch (err) {
      setError('Не удалось загрузить изображение.');
      console.error(err);
    }
  }, []);

  const handleGenerateClick = async () => {
    if (!imageBase64 || !mimeType) {
      setError('Пожалуйста, сначала загрузите изображение.');
      return;
    }
    if (!promptText.trim()) {
      setError('Пожалуйста, введите промт.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedStickers([]);

    try {
      const stickers = await generateStickers(imageBase64, mimeType, style, promptText, stickerCount);
      setGeneratedStickers(stickers);
    } catch (err) {
      console.error(err);
      setError('Не удалось сгенерировать стикеры. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadAll = async () => {
    if (generatedStickers.length === 0 || isDownloading) return;

    setIsDownloading(true);
    setError(null);
    
    try {
      const zip = new JSZip();

      generatedStickers.forEach((stickerBase64, index) => {
        zip.file(`sticker-${index + 1}.png`, stickerBase64, { base64: true });
      });

      const blob = await zip.generateAsync({ type: "blob" });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'stickers.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

    } catch (err) {
      console.error("Failed to create zip file", err);
      setError("Не удалось создать zip-архив.");
    } finally {
        setIsDownloading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Controls Column */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-cyan-400">1. Загрузите изображение</h2>
            <ImageUploader onImageUpload={handleImageUpload} previewUrl={imageBase64 ? `data:${mimeType};base64,${imageBase64}` : null} />
            
            <h2 className="text-2xl font-bold text-cyan-400 mt-4">2. Опишите ваши стикеры</h2>
            <TextInput
              label="Стиль"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="например, Мультяшный, Пиксель-арт, Акварель"
            />
            <TextInput
              label="Промт"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="например, делает смешное лицо, держит цветок"
              isTextArea={true}
            />
             <div>
                <label htmlFor="stickerCount" className="block text-sm font-medium text-gray-300 mb-2">Количество стикеров</label>
                <input
                    type="range"
                    id="stickerCount"
                    min="1"
                    max="20"
                    value={stickerCount}
                    onChange={(e) => setStickerCount(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center text-cyan-400 font-bold mt-2">{stickerCount}</div>
            </div>

            <Button onClick={handleGenerateClick} disabled={isLoading || isDownloading || !imageBase64}>
              {isLoading ? 'Генерация...' : 'Сгенерировать стикеры'}
            </Button>

            {error && <p className="text-red-400 text-center mt-2">{error}</p>}
          </div>

          {/* Results Column */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg min-h-[300px]">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-bold text-cyan-400">3. Ваши результаты</h2>
               {generatedStickers.length > 0 && (
                 <button
                   onClick={handleDownloadAll}
                   disabled={isLoading || isDownloading}
                   className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2 text-sm"
                 >
                   {isDownloading ? (
                     <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Архивация...</span>
                     </>
                   ) : (
                     <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Скачать все</span>
                     </>
                   )}
                 </button>
               )}
             </div>
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-full">
                <Loader />
                <p className="mt-4 text-gray-400">Создаем магию... это может занять минуту.</p>
              </div>
            ) : (
              generatedStickers.length > 0 ? (
                <StickerGrid stickers={generatedStickers} />
              ) : (
                <div className="flex justify-center items-center h-full text-center text-gray-500">
                  <p>Ваши сгенерированные стикеры появятся здесь.</p>
                </div>
              )
            )}
          </div>

        </div>
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
          Сделано с ❤️ и Gemini API
      </footer>
    </div>
  );
};

export default App;