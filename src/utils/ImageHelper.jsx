export const getImageUrl = (imagePath, fallback = '') => {
  const API_BASE_URL = 'http://localhost:8000'; 
  
  if (!imagePath) return fallback;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_BASE_URL}${imagePath}`;
};