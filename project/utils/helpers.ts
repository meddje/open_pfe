// Generate a unique ID for objects
export function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Format a timestamp for display
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
}

// Convert base64 to blob URL for web
export function base64ToBlob(base64: string, mimeType: string): string {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  
  return URL.createObjectURL(blob);
}

// Calculate distance between two 3D points
export function calculateDistance(point1: [number, number, number], point2: [number, number, number]): number {
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  const dz = point2[2] - point1[2];
  
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}