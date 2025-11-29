import React, { useState, useEffect } from 'react';
import { ArrowRight, MoreHorizontal, Check, Eye, EyeOff } from 'lucide-react';

// The main application component
const App = () => {
  // State for the two-step process
  const [step, setStep] = useState('email'); // 'email' or 'password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState(''); // Stores email after step 1
  // REMOVED: isInputFocused state is now local to InputField component
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Reset error message and password when step changes
  useEffect(() => {
    setErrorMessage('');
    // Clear password field if we go back to email (though in this design, we don't go back)
    if (step === 'email') {
        setPassword('');
        setSubmittedEmail('');
    }
  }, [step]);


  // Handle the continuation button click (Next/Sign In)
  const handleContinue = () => {
    setErrorMessage('');
    if (step === 'email') {
      const trimmedEmail = email.trim(); // Check trimmed value
      
      if (trimmedEmail === '') {
        setErrorMessage("Please enter an Email or Phone Number.");
        return;
      }
      
      // Simple validation: must contain '@' for email OR be a pure number for phone.
      if (!trimmedEmail.includes('@') && !/^\d+$/.test(trimmedEmail)) {
          setErrorMessage("Enter a valid Apple ID (email or phone number).");
          return;
      }

      // Simulate validation and loading transition
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSubmittedEmail(trimmedEmail); // Use the trimmed value
        setStep('password');
      }, 800); // 800ms loading simulation
    } else if (step === 'password') {
      if (password.trim() === '') {
        setErrorMessage("Please enter your password.");
        return;
      }
      // Simulate sign-in attempt and loading
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // IMPORTANT: Use a custom UI element for success/error messages, not the native alert()
        console.log(`Attempting sign-in for ${submittedEmail} with password: ${password}`);
        // Instead of a native alert(), we will log the simulated attempt
        setErrorMessage("Simulated Sign-in successful!"); // Use the existing error message area for a temporary notification
        setTimeout(() => setErrorMessage(''), 2500); // Clear after 2.5 seconds
      }, 1000);
    }
  };

  // Component to render the Apple ID input field (with floating label)
  const InputField = ({ value, setValue, label, type = 'text', readOnly = false }) => {
    // FIX: Focus state is now local to this component instance
    const [localIsInputFocused, setLocalIsInputFocused] = useState(false);

    // Check if the current field is logically a password field
    const isPasswordField = (type === 'password' || (type === 'text' && step === 'password' && label === 'Password'));
    
    // Determine if the floating label should be in the raised position
    const isRaised = localIsInputFocused || value || readOnly; // Use local state

    return (
      <div className="relative group mb-8">
        <div 
          className={`
            relative flex items-center w-full h-[56px] rounded-xl border transition-all duration-200 ease-in-out
            ${localIsInputFocused && !readOnly ? 'border-[#0071e3] ring-1 ring-[#0071e3]' : readOnly ? 'border-gray-200' : 'border-gray-300 hover:border-gray-400'}
            ${readOnly ? 'bg-gray-50' : 'bg-white'}
          `}
        >
          <input
            type={isPasswordField && !showPassword ? 'password' : type}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            // Use local focus handlers
            onFocus={() => { if (!readOnly) setLocalIsInputFocused(true); }}
            onBlur={() => { if (!readOnly) setLocalIsInputFocused(false); }}
            readOnly={readOnly}
            className={`w-full h-full px-4 pt-1 bg-transparent outline-none text-[17px] z-10 placeholder-transparent ${readOnly ? 'text-gray-700 cursor-default' : 'text-[#1d1d1f]'}`}
            id={`input-${label.replace(/\s/g, '-')}`}
            placeholder={label}
            autoComplete={isPasswordField ? 'current-password' : 'username'}
            // Handle Enter key press
            onKeyDown={(e) => {
              if (e.key === 'Enter' && value && !isLoading) {
                handleContinue();
              }
            }}
          />
          
          {/* Floating Label / Placeholder */}
          <label 
            htmlFor={`input-${label.replace(/\s/g, '-')}`}
            className={`
              absolute left-4 text-gray-500 transition-all duration-200 pointer-events-none 
              ${isRaised ? 'text-xs top-2 opacity-100' : 'text-[17px] top-[17px] opacity-60'}
              ${readOnly ? 'text-gray-500' : 'text-gray-500'}
            `}
          >
            {label}
          </label>

          {/* Show/Hide Password Button - Only visible for password step and non-empty */}
          {isPasswordField && value && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-12 text-gray-500 hover:text-[#0071e3] p-1 rounded-full transition-colors z-20 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}

          {/* Arrow Button - Only visible for the active input (Email or Password) */}
          {!readOnly && (
            <button 
              onClick={handleContinue}
              className={`
                absolute right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-20 focus:outline-none
                ${value && !isLoading 
                    ? 'border border-gray-400 hover:border-gray-500 text-gray-700 cursor-pointer opacity-100' 
                    : 'bg-transparent text-gray-300 cursor-default opacity-0'}
              `}
              disabled={!value || isLoading}
              aria-label="Continue"
            >
              {/* Show loading spinner only during the email-to-password transition */}
              {isLoading && step === 'email' ? (
                <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ArrowRight className="w-5 h-5 text-gray-700" strokeWidth={2.5} />
              )}
            </button>
          )}
        </div>
        {/* Error message display */}
        {errorMessage && (
          <p className={`text-sm mt-2 ${errorMessage.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>{errorMessage}</p>
        )}
      </div>
    );
  };

  // Component that generates the colorful dots around the logo
  const DotCircle = () => {
    const dots = [];
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
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-spin-slow">
            {dots}
        </svg>
        {/* Central Apple Logo (Inline SVG) */}
        <div className="relative z-10 p-3 bg-white rounded-full shadow-lg">
            <svg className="w-10 h-10 text-[#1d1d1f]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.48C2.7 15.25 3.66 7.79 9.35 7.69c1.46-.03 2.53.95 3.32.95.78 0 2.22-1.16 3.73-.99 1.28.14 2.23.54 2.85 1.45-2.54 1.54-2.11 5.38.44 6.44-.54 1.57-1.25 3.14-2.64 4.74zM12.03 5.25c.67-1.63 2.7-2.73 2.58-2.67 1.62-.05 2.14 2.15 2.14 2.15-.71 2.37-3.07 3.03-3.07 3.03-.89-2.02.04-3.29-1.65-2.51z"/>
            </svg>
        </div>
      </div>
    );
  };

  // Helper to change step back to email (optional, for navigation)
  const handleBack = () => {
    setStep('email');
    setPassword('');
    setErrorMessage('');
    // Note: We keep the email in the input for convenience
  };


  return (
    <div className="min-h-screen bg-white flex flex-col font-['Inter'] text-[#1d1d1f]">
      
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-3 md:px-8 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center gap-1">
          {/* Back button logic */}
          {step === 'password' && (
            <button 
                onClick={handleBack} 
                className="p-1 mr-2 text-[#0071e3] hover:text-[#005bb5] transition-colors font-medium text-lg focus:outline-none"
                aria-label="Go back to email entry"
            >
                &lt;
            </button>
          )}
          {/* Apple/iCloud logo */}
          <svg className="w-5 h-5 mb-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.48C2.7 15.25 3.66 7.79 9.35 7.69c1.46-.03 2.53.95 3.32.95.78 0 2.22-1.16 3.73-.99 1.28.14 2.23.54 2.85 1.45-2.54 1.54-2.11 5.38.44 6.44-.54 1.57-1.25 3.14-2.64 4.74zM12.03 5.25c.67-1.63 2.7-2.73 2.58-2.67 1.62-.05 2.14 2.15 2.14 2.15-.71 2.37-3.07 3.03-3.07 3.03-.89-2.02.04-3.29-1.65-2.51z"/>
            </svg>
          <span className="font-semibold text-xl tracking-tight">iCloud</span>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-start md:items-center justify-center p-4">
        
        {/* Card Container (Responsive Styling) */}
        <div className="w-full max-w-[440px] md:bg-white md:shadow-2xl md:rounded-[2rem] p-6 md:p-12 transition-all duration-300 transform md:border border-gray-100/50">
          
          {/* Logo Animation Section */}
          <DotCircle />

          {/* Title - Static (Always 'Sign in with Apple ID') */}
          <h1 className="text-[28px] font-semibold text-center mb-10 leading-snug">
            Sign in with Apple ID
          </h1>

          {/* Conditional Rendering based on Step */}
          
          {/* Step 1: Email Entry */}
          {step === 'email' && (
            <InputField 
              value={email}
              setValue={setEmail}
              label="Email or Phone Number"
              type="text" 
            />
          )}

          {/* Step 2: Password Entry */}
          {step === 'password' && (
            <>
              {/* Read-only Email Field */}
              <InputField 
                value={submittedEmail}
                setValue={() => {}} // Read-only
                label="Email or Phone Number"
                type="text"
                readOnly={true}
              />

              {/* Password Field */}
              <InputField
                value={password}
                setValue={setPassword}
                label="Password"
                type="password"
              />

              {/* Forgot Password Link is centered here now that the helper button is gone */}
              <div className="flex justify-center -mt-4 mb-4">
                <a 
                  href="https://iforgot.apple.com/password/verify/appleid" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#0071e3] hover:underline text-sm font-medium"
                >
                  Forgot password?
                </a>
              </div>
            </>
          )}

          {/* Keep me signed in Checkbox (visible in both steps) */}
          <div className="flex items-center justify-center gap-2 mb-12">
            <div 
              onClick={() => setKeepSignedIn(!keepSignedIn)}
              role="checkbox"
              aria-checked={keepSignedIn}
              tabIndex={0}
              className={`
                w-5 h-5 rounded border cursor-pointer flex items-center justify-center transition-all duration-150
                ${keepSignedIn ? 'bg-[#0071e3] border-[#0071e3]' : 'border-gray-400 bg-white hover:border-[#0071e3]'}
              `}
            >
              {keepSignedIn && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </div>
            <span className="text-[15px] text-[#1d1d1f] cursor-pointer select-none" onClick={() => setKeepSignedIn(!keepSignedIn)}>
              Keep me signed in
            </span>
          </div>

          {/* Conditional Forgot Password Link for Email Step (Only visible in email step) */}
          {step === 'email' && (
            <div className="flex flex-col items-center gap-2 text-[13px] md:text-[14px]">
              <a 
                href="https://iforgot.apple.com/password/verify/appleid" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#0071e3] hover:underline flex items-center gap-1 font-medium"
              >
                Forgot password? 
                <span className="text-[10px] align-top">↗</span>
              </a>
            </div>
          )}

          {/* Unconditional Create Apple Account Link (Visible in both steps - Moved outside the email step block) */}
          <div className={`flex flex-col items-center text-[13px] md:text-[14px] ${step === 'email' ? 'mt-4' : 'mt-8'}`}>
            <a 
              href="https://www.icloud.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#0071e3] hover:underline font-medium"
            >
              Create Apple Account
            </a>
          </div>


        </div>
      </main>

      {/* Footer Text */}
      <footer className="py-6 text-center text-gray-500 text-sm">
          Privacy Policy | Terms of Use
      </footer>

      {/* Custom Styles for Animation */}
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
};

export default App;
