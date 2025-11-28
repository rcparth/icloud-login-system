import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, Download, ExternalLink, Check } from "lucide-react";
import { toast } from "sonner";

interface SuccessScreenProps {
  email: string;
  name: string;
}

const SuccessScreen = ({ email, name }: SuccessScreenProps) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedName, setCopiedName] = useState(false);

  const copyToClipboard = async (text: string, type: "email" | "name") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "email") {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedName(true);
        setTimeout(() => setCopiedName(false), 2000);
      }
      toast.success(`${type === "email" ? "Email" : "Name"} copied!`);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const saveCredentials = () => {
    const content = `Registration Credentials\n\nEmail: ${email}\nName: ${name}\n\nRegistered on: ${new Date().toLocaleString()}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "credentials.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Credentials saved!");
  };

  const redirectToYouTube = () => {
    window.open("https://youtube.com/", "_blank");
  };

  return (
    <div className="w-full max-w-md bg-card rounded-2xl shadow-card p-8 animate-scale-in">
      <div className="flex flex-col items-center">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full gradient-success flex items-center justify-center animate-pulse-glow">
          <CheckCircle2 className="w-10 h-10 text-success-foreground" />
        </div>
        
        {/* Title */}
        <h1 className="mt-6 text-2xl font-semibold text-foreground tracking-tight animate-fade-in-up">
          Registration Successful!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Your credentials have been saved
        </p>

        {/* Credentials */}
        <div className="w-full mt-8 space-y-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">
                <span className="font-medium">New ID: email</span>
                <span className="text-muted-foreground"> - </span>
                <span className="font-semibold">{email}</span>
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(email, "email")}
              className="ml-3 p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {copiedEmail ? (
                <Check className="w-5 h-5 text-success" />
              ) : (
                <Copy className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">
                <span className="font-medium">Name:</span>
                <span className="text-muted-foreground"> - </span>
                <span className="font-semibold">{name}</span>
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(name, "name")}
              className="ml-3 p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {copiedName ? (
                <Check className="w-5 h-5 text-success" />
              ) : (
                <Copy className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full mt-6 space-y-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl border-border hover:bg-accent"
            onClick={saveCredentials}
          >
            <Download className="w-4 h-4 mr-2" />
            Save Credentials
          </Button>

          <Button
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={redirectToYouTube}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
