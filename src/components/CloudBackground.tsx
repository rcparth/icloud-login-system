import { Cloud } from "lucide-react";

const CloudBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Floating clouds */}
      <Cloud 
        className="absolute top-20 left-10 text-cloud-glow/30 animate-float" 
        size={80} 
        style={{ animationDelay: '0s' }}
      />
      <Cloud 
        className="absolute top-40 right-20 text-cloud-glow/20 animate-float" 
        size={120} 
        style={{ animationDelay: '2s' }}
      />
      <Cloud 
        className="absolute bottom-40 left-1/4 text-cloud-glow/25 animate-float" 
        size={100} 
        style={{ animationDelay: '4s' }}
      />
      <Cloud 
        className="absolute top-1/3 right-1/3 text-cloud-glow/15 animate-float" 
        size={60} 
        style={{ animationDelay: '1s' }}
      />
      <Cloud 
        className="absolute bottom-20 right-10 text-cloud-glow/20 animate-float" 
        size={90} 
        style={{ animationDelay: '3s' }}
      />
    </div>
  );
};

export default CloudBackground;
