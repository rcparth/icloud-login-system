import { Cloud } from "lucide-react";

const ColorfulRing = () => {
  // Generate dots around a circle with rainbow colors
  const dots = [];
  const numDots = 36;
  const radius = 52;
  
  const colors = [
    '#3B82F6', '#22D3EE', '#10B981', '#84CC16', 
    '#EAB308', '#F97316', '#EF4444', '#EC4899',
    '#A855F7', '#8B5CF6', '#6366F1', '#3B82F6'
  ];

  for (let i = 0; i < numDots; i++) {
    const angle = (i / numDots) * 2 * Math.PI - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const colorIndex = Math.floor((i / numDots) * colors.length);
    const size = 4 + Math.sin(i * 0.3) * 2;
    const opacity = 0.6 + Math.random() * 0.4;
    
    dots.push(
      <circle
        key={i}
        cx={64 + x}
        cy={64 + y}
        r={size}
        fill={colors[colorIndex]}
        opacity={opacity}
      />
    );
  }

  // Add inner ring of smaller dots
  const innerDots = [];
  const innerRadius = 38;
  const numInnerDots = 24;
  
  for (let i = 0; i < numInnerDots; i++) {
    const angle = (i / numInnerDots) * 2 * Math.PI - Math.PI / 2 + 0.1;
    const x = Math.cos(angle) * innerRadius;
    const y = Math.sin(angle) * innerRadius;
    const colorIndex = Math.floor((i / numInnerDots) * colors.length);
    const size = 2 + Math.sin(i * 0.4) * 1;
    const opacity = 0.4 + Math.random() * 0.3;
    
    innerDots.push(
      <circle
        key={`inner-${i}`}
        cx={64 + x}
        cy={64 + y}
        r={size}
        fill={colors[colorIndex]}
        opacity={opacity}
      />
    );
  }

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg 
        className="absolute inset-0 animate-rotate-ring" 
        viewBox="0 0 128 128"
        style={{ animationDuration: '12s' }}
      >
        {dots}
      </svg>
      <svg 
        className="absolute inset-0 animate-rotate-ring" 
        viewBox="0 0 128 128"
        style={{ animationDuration: '18s', animationDirection: 'reverse' }}
      >
        {innerDots}
      </svg>
      <div className="relative z-10">
        <Cloud className="w-10 h-10 text-foreground" strokeWidth={1.5} />
      </div>
    </div>
  );
};

export default ColorfulRing;
