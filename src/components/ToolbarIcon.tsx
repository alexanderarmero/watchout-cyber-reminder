
import { useEffect } from 'react';
import { TriangleAlert } from 'lucide-react';

const ToolbarIcon = () => {
  useEffect(() => {
    // Create favicon link element
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'icon';
    
    // Create SVG for favicon
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    `;
    
    // Convert SVG to data URL
    const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    
    link.href = url;
    document.head.appendChild(link);

    // Cleanup
    return () => {
      URL.revokeObjectURL(url);
      link.remove();
    };
  }, []);

  return null;
};

export default ToolbarIcon;
