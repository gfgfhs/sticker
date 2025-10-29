
import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  isTextArea?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({ label, isTextArea = false, ...props }) => {
  const commonClasses = "w-full bg-gray-700 text-white rounded-md border-gray-600 focus:border-cyan-500 focus:ring focus:ring-cyan-500 focus:ring-opacity-50 transition duration-200";
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      {isTextArea ? (
        <textarea {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} rows={3} className={commonClasses + " p-2"} />
      ) : (
        <input {...(props as React.InputHTMLAttributes<HTMLInputElement>)} type="text" className={commonClasses + " p-2"} />
      )}
    </div>
  );
};
