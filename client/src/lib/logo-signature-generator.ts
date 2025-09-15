// Logo and Signature Generator for ID Cards
export interface GeneratedLogo {
  svg: string;
  backgroundColor: string;
}

export interface GeneratedSignature {
  svg: string;
}

// University/Organization names to initials
function getInitials(name: string): string {
  const words = name.split(' ');
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return words
    .filter(word => word.length > 2 && !['of', 'and', 'the', 'for'].includes(word.toLowerCase()))
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();
}

// Generate a random logo based on organization name
export function generateOrganizationLogo(organizationName: string): GeneratedLogo {
  const initials = getInitials(organizationName);
  const logoStyles = ['circle', 'shield', 'hexagon', 'square', 'diamond'];
  const style = logoStyles[Math.floor(Math.random() * logoStyles.length)];
  
  // Color schemes for educational institutions
  const colorSchemes = [
    { primary: '#1e40af', secondary: '#3b82f6', bg: '#dbeafe' }, // Blue
    { primary: '#7c2d12', secondary: '#dc2626', bg: '#fee2e2' }, // Red
    { primary: '#14532d', secondary: '#16a34a', bg: '#dcfce7' }, // Green
    { primary: '#581c87', secondary: '#9333ea', bg: '#f3e8ff' }, // Purple
    { primary: '#92400e', secondary: '#d97706', bg: '#fef3c7' }, // Amber
    { primary: '#0f172a', secondary: '#475569', bg: '#f1f5f9' }, // Slate
  ];
  
  const colors = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
  
  let svgPath = '';
  
  switch (style) {
    case 'circle':
      svgPath = `
        <circle cx="50" cy="50" r="45" fill="${colors.primary}"/>
        <circle cx="50" cy="50" r="38" fill="none" stroke="${colors.secondary}" stroke-width="2"/>
      `;
      break;
    case 'shield':
      svgPath = `
        <path d="M50 10 L85 25 L85 60 Q85 90 50 95 Q15 90 15 60 L15 25 Z" 
              fill="${colors.primary}"/>
        <path d="M50 18 L78 30 L78 60 Q78 82 50 87 Q22 82 22 60 L22 30 Z" 
              fill="${colors.secondary}" opacity="0.3"/>
      `;
      break;
    case 'hexagon':
      svgPath = `
        <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" 
                 fill="${colors.primary}"/>
        <polygon points="50,20 75,35 75,65 50,80 25,65 25,35" 
                 fill="none" stroke="${colors.secondary}" stroke-width="2"/>
      `;
      break;
    case 'square':
      svgPath = `
        <rect x="15" y="15" width="70" height="70" rx="8" fill="${colors.primary}"/>
        <rect x="22" y="22" width="56" height="56" rx="4" fill="none" 
              stroke="${colors.secondary}" stroke-width="2"/>
      `;
      break;
    case 'diamond':
      svgPath = `
        <polygon points="50,10 85,50 50,90 15,50" fill="${colors.primary}"/>
        <polygon points="50,20 75,50 50,80 25,50" fill="none" 
                 stroke="${colors.secondary}" stroke-width="2"/>
      `;
      break;
  }
  
  const svg = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      ${svgPath}
      <text x="50" y="55" text-anchor="middle" dominant-baseline="middle" 
            fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">
        ${initials}
      </text>
    </svg>
  `;
  
  return {
    svg: svg.trim(),
    backgroundColor: colors.bg
  };
}

// Generate a realistic-looking signature
export function generateSignature(name: string): GeneratedSignature {
  const firstName = name.split(' ')[0];
  const lastName = name.split(' ').slice(-1)[0];
  
  // Signature styles
  const styles = ['cursive', 'scribble', 'initials', 'flowing', 'angular'];
  const style = styles[Math.floor(Math.random() * styles.length)];
  
  // Signature colors (blue/black ink)
  const inkColors = ['#1e293b', '#1e40af', '#0f172a', '#172554'];
  const inkColor = inkColors[Math.floor(Math.random() * inkColors.length)];
  
  let path = '';
  
  // Generate random control points for bezier curves
  const randomOffset = () => Math.random() * 10 - 5;
  
  switch (style) {
    case 'cursive':
      // Flowing cursive signature
      path = `M 10,40 Q ${20 + randomOffset()},${30 + randomOffset()} 30,40 
              T 50,${40 + randomOffset()} 
              Q ${60 + randomOffset()},${35 + randomOffset()} 70,40
              T 85,${38 + randomOffset()}
              L ${88 + randomOffset()},${42 + randomOffset()}`;
      break;
      
    case 'scribble':
      // Quick scribble signature
      path = `M 10,40 C ${15 + randomOffset()},${35 + randomOffset()} 
              ${25 + randomOffset()},${45 + randomOffset()} 35,40
              C ${45 + randomOffset()},${35 + randomOffset()} 
              ${55 + randomOffset()},${42 + randomOffset()} 65,40
              C ${70 + randomOffset()},${38 + randomOffset()} 
              ${80 + randomOffset()},${36 + randomOffset()} 85,40
              M 10,${42 + randomOffset()} L 85,${38 + randomOffset()}`;
      break;
      
    case 'initials':
      // Just initials with underline
      const firstInitial = firstName[0].toUpperCase();
      const lastInitial = lastName[0].toUpperCase();
      return {
        svg: `
          <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
            <text x="25" y="35" font-family="'Brush Script MT', cursive" 
                  font-size="28" fill="${inkColor}" font-style="italic">
              ${firstInitial}.
            </text>
            <text x="50" y="35" font-family="'Brush Script MT', cursive" 
                  font-size="32" fill="${inkColor}" font-style="italic">
              ${lastInitial}.
            </text>
            <path d="M 10,42 L 85,40" stroke="${inkColor}" stroke-width="1.5" 
                  opacity="0.6" fill="none"/>
          </svg>
        `.trim()
      };
      
    case 'flowing':
      // Flowing signature with loops
      path = `M 10,35 C 20,25 25,45 35,35
              C 40,30 45,40 50,35
              S 60,30 65,35
              C 70,40 75,30 80,35
              L 85,30
              M 15,40 Q 50,${45 + randomOffset()} 80,38`;
      break;
      
    case 'angular':
      // Angular modern signature
      path = `M 10,40 L ${20 + randomOffset()},${30 + randomOffset()} 
              L ${30 + randomOffset()},${42 + randomOffset()}
              L ${40 + randomOffset()},${35 + randomOffset()}
              L ${50 + randomOffset()},${40 + randomOffset()}
              L ${60 + randomOffset()},${32 + randomOffset()}
              L ${70 + randomOffset()},${41 + randomOffset()}
              L ${80 + randomOffset()},${35 + randomOffset()}
              L 85,40`;
      break;
  }
  
  // Add some random flourishes
  const addFlourish = Math.random() > 0.5;
  let flourish = '';
  if (addFlourish && style !== 'initials') {
    flourish = `M ${75 + randomOffset()},${38 + randomOffset()} 
                Q ${82 + randomOffset()},${45 + randomOffset()} 88,35`;
  }
  
  const svg = `
    <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
      <path d="${path}" stroke="${inkColor}" stroke-width="2" 
            fill="none" stroke-linecap="round" stroke-linejoin="round"
            opacity="0.8"/>
      ${flourish ? `<path d="${flourish}" stroke="${inkColor}" stroke-width="1.5" 
            fill="none" stroke-linecap="round" opacity="0.6"/>` : ''}
    </svg>
  `;
  
  return {
    svg: svg.trim()
  };
}

// Generate barcode
export function generateBarcode(data: string): string {
  const barcodeWidth = 150;
  const barcodeHeight = 40;
  const barWidth = 2;
  
  // Simple barcode pattern based on data
  let bars = '';
  let x = 5;
  
  // Convert data to binary pattern
  for (let i = 0; i < Math.min(data.length, 20); i++) {
    const charCode = data.charCodeAt(i);
    const pattern = charCode.toString(2).padStart(8, '0');
    
    for (let bit of pattern) {
      const height = bit === '1' ? barcodeHeight : barcodeHeight * 0.7;
      const y = bit === '1' ? 0 : barcodeHeight * 0.15;
      bars += `<rect x="${x}" y="${y}" width="${barWidth}" height="${height}" fill="#000"/>`;
      x += barWidth + 1;
      
      if (x > barcodeWidth - 10) break;
    }
    if (x > barcodeWidth - 10) break;
  }
  
  return `
    <svg viewBox="0 0 ${barcodeWidth} ${barcodeHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${barcodeWidth}" height="${barcodeHeight}" fill="white"/>
      ${bars}
      <text x="${barcodeWidth/2}" y="${barcodeHeight - 2}" text-anchor="middle" 
            font-size="8" font-family="monospace" fill="#000">
        ${data.substring(0, 15)}
      </text>
    </svg>
  `.trim();
}

// Generate a security pattern overlay
export function generateSecurityPattern(color: string = '#000'): string {
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" opacity="0.05">
      <defs>
        <pattern id="security" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="${color}"/>
          <circle cx="12" cy="12" r="1" fill="${color}"/>
          <path d="M0,10 L10,0 M10,20 L20,10" stroke="${color}" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#security)"/>
    </svg>
  `.trim();
}