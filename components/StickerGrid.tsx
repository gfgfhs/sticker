
import React from 'react';

interface StickerGridProps {
  stickers: string[];
}

export const StickerGrid: React.FC<StickerGridProps> = ({ stickers }) => {
  const downloadSticker = (base64Data: string, index: number) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${base64Data}`;
    link.download = `sticker-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-in">
      {stickers.map((stickerBase64, index) => (
        <div key={index} className="relative group aspect-square bg-gray-700/50 rounded-lg overflow-hidden shadow-md">
          <img
            src={`data:image/png;base64,${stickerBase64}`}
            alt={`Generated Sticker ${index + 1}`}
            className="w-full h-full object-contain"
          />
           <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex justify-center items-center">
             <button
               onClick={() => downloadSticker(stickerBase64, index)}
               className="opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-90 transition-all duration-300 bg-cyan-500 text-white p-2 rounded-full"
               title="Скачать стикер"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
             </button>
           </div>
        </div>
      ))}
    </div>
  );
};

// Add fade-in animation to tailwind config if possible, or define here
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);
