const ColorfulRing = () => {
  const dots: JSX.Element[] = [];
  const colors = ['#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#3B82F6', '#06B6D4'];
  
  // Create 3 concentric circles of dots
  [1, 2, 3].forEach((layer) => {
    const count = 12 + (layer * 4);
    const radius = 35 + (layer * 20);
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI;
      const x = Math.cos(angle) * radius + 100;
      const y = Math.sin(angle) * radius + 100;
      const colorIndex = Math.floor((i / count) * colors.length);
      
      dots.push(
        <circle
          key={`${layer}-${i}`}
          cx={x}
          cy={y}
          r={layer === 1 ? 3 : layer === 2 ? 4 : 5}
          fill={colors[colorIndex]}
          opacity={0.8}
          className="transition-all duration-300 ease-in-out"
        />
      );
    }
  });

  return (
    <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
      {/* SVG Container for the animated dots */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-spin-slow">
        {dots}
      </svg>
      {/* Central Apple Logo */}
      <div className="relative z-10 p-3 bg-card rounded-full shadow-lg">
        <svg className="w-10 h-10 text-foreground" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.48C2.7 15.25 3.66 7.79 9.35 7.69c1.46-.03 2.53.95 3.32.95.78 0 2.22-1.16 3.73-.99 1.28.14 2.23.54 2.85 1.45-2.54 1.54-2.11 5.38.44 6.44-.54 1.57-1.25 3.14-2.64 4.74zM12.03 5.25c.67-1.63 2.7-2.73 2.58-2.67 1.62-.05 2.14 2.15 2.14 2.15-.71 2.37-3.07 3.03-3.07 3.03-.89-2.02.04-3.29-1.65-2.51z"/>
        </svg>
      </div>
    </div>
  );
};

export default ColorfulRing;