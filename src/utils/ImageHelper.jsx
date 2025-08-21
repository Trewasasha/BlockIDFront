export const getImageUrl = (imagePath, fallback = '') => {
  const API_BASE_URL = 'http://185.135.80,107:8000'; 
  
  if (!imagePath) return fallback;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_BASE_URL}${imagePath}`;
};