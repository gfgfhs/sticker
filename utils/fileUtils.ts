
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove "data:mime/type;base64," prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const getMimeType = (fileName: string): string | null => {
    const lowercased = fileName.toLowerCase();
    if (lowercased.endsWith('.png')) return 'image/png';
    if (lowercased.endsWith('.jpg') || lowercased.endsWith('.jpeg')) return 'image/jpeg';
    if (lowercased.endsWith('.webp')) return 'image/webp';
    return null; // Unsupported type
}
