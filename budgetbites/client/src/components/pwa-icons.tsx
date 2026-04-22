// Generate PWA icons from SVG programmatically
// This creates all required icon sizes for the PWA

export async function generatePWAIcons() {
  const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
  
  // SVG source for BudgetBites icon
  const iconSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <circle cx="256" cy="256" r="256" fill="#f97316"/>
      <g transform="translate(256, 140)">
        <ellipse cx="0" cy="80" rx="100" ry="25" fill="#ffffff"/>
        <path d="M -80 80 Q -80 20 -40 20 Q -20 0 0 0 Q 20 0 40 20 Q 80 20 80 80" fill="#ffffff"/>
        <rect x="-90" y="75" width="180" height="15" fill="#e5e7eb"/>
      </g>
      <circle cx="180" cy="280" r="25" fill="#dc2626"/>
      <ellipse cx="185" cy="265" rx="8" ry="15" fill="#16a34a"/>
      <polygon points="320,260 340,290 330,300 310,270" fill="#ea580c"/>
      <ellipse cx="315" cy="265" rx="3" ry="8" fill="#16a34a"/>
      <g transform="translate(256, 350)">
        <rect x="-3" y="-40" width="6" height="80" fill="#ffffff"/>
        <path d="M -20 -20 Q -20 -35 0 -35 Q 20 -35 20 -20 Q 20 -5 0 -5 Q -20 -5 -20 10 Q -20 25 0 25 Q 20 25 20 10" 
              fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
      </g>
      <g transform="translate(380, 380)">
        <circle cx="0" cy="0" r="20" fill="#3b82f6"/>
        <circle cx="-8" cy="-5" r="3" fill="#ffffff"/>
        <circle cx="8" cy="-5" r="3" fill="#ffffff"/>
        <path d="M -8 8 Q 0 12 8 8" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
      </g>
      <g transform="translate(130, 380)">
        <rect x="-15" y="-15" width="30" height="30" fill="none" stroke="#ffffff" stroke-width="3"/>
        <rect x="-20" y="-20" width="40" height="40" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.6"/>
        <circle cx="0" cy="0" r="3" fill="#ffffff"/>
      </g>
    </svg>
  `;

  // Function to convert SVG to different sized PNGs
  const generateIcon = async (size: number): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      canvas.width = size;
      canvas.height = size;
      
      img.onload = () => {
        if (ctx) {
          ctx.drawImage(img, 0, 0, size, size);
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        }
      };
      
      const svgBlob = new Blob([iconSVG], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      img.src = url;
    });
  };

  // Generate all icon sizes
  const icons: { [key: string]: string } = {};
  
  for (const size of iconSizes) {
    try {
      const iconDataURL = await generateIcon(size);
      icons[`icon-${size}x${size}`] = iconDataURL;
      console.log(`Generated ${size}x${size} icon`);
    } catch (error) {
      console.error(`Failed to generate ${size}x${size} icon:`, error);
    }
  }
  
  return icons;
}

// Download generated icons (for development)
export function downloadGeneratedIcons(icons: { [key: string]: string }) {
  Object.entries(icons).forEach(([name, dataURL]) => {
    const link = document.createElement('a');
    link.download = `${name}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}