
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg p-4 sticky top-0 z-10">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center text-white">
          <span className="text-cyan-400">AI</span> Генератор Стикеров
        </h1>
        <p className="text-center text-gray-400 mt-1">Превратите любое фото в уникальный набор стикеров</p>
      </div>
    </header>
  );
};
