import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, MoreHorizontal, Check, Loader2 } from 'lucide-react';

// --- Assets ---
const AppleLogo = ({ className }) => (
  <svg viewBox="0 0 384 512" fill="currentColor" className={className}>
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

const ICloudLogo = () => (
  <div className="flex items-center gap-1">
    <AppleLogo className="w-5 h-5 mb-1" />
    <span className="text-xl font-medium tracking-tight">iCloud</span>
  </div>
);

// --- Components ---

/**
 * Generates the colorful dot circle seen in the screenshots.
 */
const DotCircle = () => {
  const rings = [
    { count: 12, radius: 35, size: 4 },
    { count: 20, radius: 50, size: 5 },
    { count: 28, radius: 65, size: 6 },
  ];

  const dots = [];

  rings.forEach((ring, ringIndex) => {
    for (let i = 0; i < ring.count; i++) {
      const angle = (i / ring.count) * 2 * Math.PI;
      const rotationOffset = -Math.PI / 2; 
      const x = Math.cos(angle + rotationOffset) * ring.radius;
      const y = Math.sin(angle + rotationOffset) * ring.radius;
      
      const angleForHue = (angle * 180 / Math.PI);
      
      let specificHue = 0;
      if (angleForHue >= 0 && angleForHue < 90) specificHue = 190 + (angleForHue/90)*30; 
      else if (angleForHue >= 90 && angleForHue < 180) specificHue = 220 + ((angleForHue-90)/90)*60; 
      else if (angleForHue >= 180 && angleForHue < 270) specificHue = 300 + ((angleForHue-180)/90)*40; 
      else specificHue = 340 + ((angleForHue-270)/90)*70; 

      let color = `hsl(${specificHue}, 90%, 60%)`;

      dots.push({
        x: 150 + x, 
        y: 150 + y,
        size: ring.size,
        color: color,
        delay: Math.random() * 2 
      });
    }
  });

  return (
    <div className="relative w-[300px] h-[300px] flex items-center justify-center">
      <svg width="300" height="300" className="absolute top-0 left-0 animate-spin-slow">
        {dots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r={dot.size}
            fill={dot.color}
            className="opacity-90 transition-all duration-1000"
          />
        ))}
      </svg>
      
      <div className="z-10 text-black">
         <AppleLogo className="w-16 h-16" />
      </div>
    </div>
  );
};

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('email'); 
  const [loading, setLoading] = useState(false);
  const [keepSigned, setKeepSigned] = useState(false);
  const [animating, setAnimating] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [step]);

  const handleNext = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    
    if (step === 'email') {
      setAnimating(true);
      setTimeout(() => {
        setStep('password');
        setAnimating(false);
      }, 300);
    } else {
      console.log('Logging in with', email, password);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] font-sans flex flex-col items-center selection:bg-blue-200">
      
      {/* Navbar */}
      <nav className="w-full max-w-[1920px] px-6 h-12 flex items-center justify-between z-20">
        <div className="opacity-80 hover:opacity-100 cursor-pointer transition-opacity">
          <ICloudLogo />
        </div>
        <button className="p-2 rounded-full hover:bg-gray-200 transition-colors opacity-60 hover:opacity-100">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center justify-center p-4 -mt-12">
        
        {/* Card */}
        <div className="w-full max-w-[440px] bg-white rounded-[24px] shadow-sm md:shadow-xl p-8 md:p-12 flex flex-col items-center text-center relative overflow-hidden transition-all duration-500 ease-out">
          
          {/* Graphic */}
          <div className="mb-6 scale-90 md:scale-100 transition-transform duration-500">
            <DotCircle />
          </div>

          {/* Title */}
          <h1 className="text-[28px] font-semibold text-slate-900 mb-8 leading-tight tracking-tight">
            Sign in with Apple&nbsp;Account
          </h1>

          {/* Form */}
          <form onSubmit={handleNext} className="w-full relative">
            <div className={`transition-all duration-500 ease-in-out ${animating ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0'}`}>
              
              {step === 'email' ? (
                // Email Step
                <div className="relative group">
                  <input
                    ref={inputRef}
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email or Phone Number"
                    className="w-full h-[54px] rounded-[14px] border border-gray-300 px-4 text-[17px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-2 focus:border-[#0071E3] focus:ring-0 transition-all bg-white"
                  />
                  
                  <button
                    type="submit"
                    disabled={!email || loading}
                    className={`absolute right-2 top-2 h-[38px] w-[38px] rounded-full flex items-center justify-center transition-all duration-200
                      ${email ? 'bg-[#0071E3] text-white hover:bg-[#0077ED] cursor-pointer' : 'bg-transparent text-gray-300 cursor-default'}
                    `}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ArrowRight className={`w-5 h-5 transition-transform ${email ? 'rotate-0' : '-rotate-45 opacity-0'}`} />
                    )}
                  </button>
                </div>
              ) : (
                // Password Step - Stacked UI
                <div className="relative flex flex-col w-full">
                   
                   {/* Top: Read-only Email Field */}
                   <div className="relative w-full h-[56px] rounded-t-[14px] border border-gray-300 border-b-0 bg-white px-4 flex flex-col justify-center z-10 text-left">
                     <span className="text-[12px] text-gray-500 leading-tight">Email or Phone Number</span>
                     <span className="text-[17px] text-gray-900 leading-tight truncate mt-0.5">{email}</span>
                   </div>

                  {/* Bottom: Password Input */}
                  <div className="relative w-full h-[56px] z-20">
                    <input
                        ref={inputRef}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full h-full rounded-b-[14px] border-2 border-[#0071E3] px-4 text-[17px] text-gray-900 placeholder:text-gray-500 focus:outline-none bg-white -mt-[1px]"
                    />
                    
                    <button
                        type="submit"
                        disabled={!password || loading}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 h-[30px] w-[30px] rounded-full flex items-center justify-center transition-all duration-200 hover:bg-gray-100
                        ${password ? 'text-[#0071E3] cursor-pointer' : 'text-gray-300 cursor-default'}
                        `}
                    >
                        {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                        ) : (
                        <ArrowRight className="w-6 h-6 p-0.5 border-2 rounded-full border-current" strokeWidth={2.5} />
                        )}
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Checkbox */}
            <div className="flex items-center justify-center mt-8 gap-2">
                <div 
                    className={`w-5 h-5 border rounded transition-colors flex items-center justify-center cursor-pointer ${keepSigned ? 'bg-[#0071E3] border-[#0071E3]' : 'border-gray-400 bg-white'}`}
                    onClick={() => setKeepSigned(!keepSigned)}
                >
                    {keepSigned && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </div>
                <label 
                    className="text-[15px] text-gray-700 cursor-pointer select-none"
                    onClick={() => setKeepSigned(!keepSigned)}
                >
                    Keep me signed in
                </label>
            </div>
          </form>

          {/* Links */}
          <div className="mt-8 flex flex-col gap-3 items-center">
            <a 
              href="https://iforgot.apple.com/password/verify/appleid" 
              target="_blank" 
              rel="noreferrer"
              className="text-[#0071E3] text-[15px] font-normal hover:underline decoration-[#0071E3]"
            >
              Forgot password?
              <span className="inline-block ml-0.5 transform -rotate-45 text-[10px]">↗</span>
            </a>
            
            <a 
              href="https://appleid.apple.com/account" 
              target="_blank" 
              rel="noreferrer"
              className="text-[#0071E3] text-[15px] font-normal hover:underline decoration-[#0071E3]"
            >
            Create Apple Account
            </a>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center border-t border-gray-200/50 bg-[#F5F5F7] text-[11px] text-gray-500 space-y-2 mb-2">
        <div className="flex justify-center gap-4 flex-wrap px-4">
          <a href="#" className="hover:underline">Create Apple ID</a>
          <span className="text-gray-300">|</span>
          <a href="#" className="hover:underline">System Status</a>
          <span className="text-gray-300">|</span>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <span className="text-gray-300">|</span>
          <a href="#" className="hover:underline">Terms & Conditions</a>
        </div>
        <div>
          Copyright © 2025 Apple Inc. All rights reserved.
        </div>
      </footer>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
      `}</style>
    </div>
  );
}
