import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Loader2 } from "lucide-react";
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

  return (
    <div className="w-full max-w-md bg-card rounded-2xl shadow-card p-8 animate-scale-in">
      <div className="flex flex-col items-center">
        {/* Colorful Ring with Logo */}
        <ColorfulRing />
        
        {/* Title */}
        <h1 className="mt-6 text-2xl font-semibold text-foreground tracking-tight">
          {step === "name" ? "Welcome" : "Sign in"}
        </h1>
        
        {/* Form */}
        {step === "name" ? (
          <form onSubmit={handleSubmitName} className="w-full mt-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 pl-4 pr-12 text-base rounded-xl border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-destructive text-center">{error}</p>
            )}
          </form>
        ) : (
          <form onSubmit={handleSubmitEmail} className="w-full mt-8">
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 pl-4 pr-12 text-base rounded-xl border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isLoading}
                autoFocus
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-destructive text-center">{error}</p>
            )}
          </form>
        )}

        {/* Keep me signed in */}
        <div className="flex items-center gap-2 mt-8">
          <Checkbox
            id="keep-signed"
            checked={keepSignedIn}
            onCheckedChange={(checked) => setKeepSignedIn(checked === true)}
            className="rounded border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <label
            htmlFor="keep-signed"
            className="text-sm text-muted-foreground cursor-pointer"
          >
            Keep me signed in
          </label>
        </div>

        {/* Links */}
        <div className="flex flex-col items-center gap-1 mt-6">
          {step === "email" && (
            <button
              type="button"
              onClick={() => setStep("name")}
              className="text-sm text-primary hover:underline"
            >
              ← Back to name
            </button>
          )}
          <button
            type="button"
            className="text-sm text-primary hover:underline"
          >
            Forgot password? →
          </button>
          <button
            type="button"
            className="text-sm text-primary hover:underline"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
