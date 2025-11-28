import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, UserPlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const registrationSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255),
  name: z.string().trim().min(1, { message: "Name is required" }).max(100, { message: "Name must be less than 100 characters" }),
});

interface RegistrationFormProps {
  onSuccess: (data: { email: string; name: string }) => void;
}

const RegistrationForm = ({ onSuccess }: RegistrationFormProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; name?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate input
    const result = registrationSchema.safeParse({ email, name });
    if (!result.success) {
      const fieldErrors: { email?: string; name?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "name") fieldErrors.name = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("registrations")
        .insert([{ email: result.data.email, name: result.data.name }]);

      if (error) {
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
    <Card className="w-full max-w-md shadow-cloud border-0 bg-card/80 backdrop-blur-sm animate-scale-in">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 rounded-full gradient-cloud flex items-center justify-center mb-4 glow-cloud">
          <Cloud className="w-8 h-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">Welcome</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your details to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background/50 border-border focus:ring-primary"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/50 border-border focus:ring-primary"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>
          <Button 
            type="submit" 
            className="w-full gradient-cloud text-primary-foreground hover:opacity-90 transition-opacity shadow-cloud"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Login
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;
