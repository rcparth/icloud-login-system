import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      toast.success(`${type === "email" ? "Email" : "Name"} copied to clipboard!`);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
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
    <Card className="w-full max-w-md shadow-success border-0 bg-card/80 backdrop-blur-sm animate-scale-in">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-20 h-20 rounded-full gradient-success flex items-center justify-center mb-4 animate-pulse-glow">
          <CheckCircle2 className="w-10 h-10 text-success-foreground" />
        </div>
        <CardTitle className="text-2xl font-bold text-success animate-fade-in-up">
          Registration Successful!
        </CardTitle>
        <CardDescription className="text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Your account has been created in the cloud
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Credentials Display */}
        <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-accent/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-foreground font-semibold truncate">{email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(email, "email")}
                className="shrink-0 hover:bg-primary/10"
              >
                {copiedEmail ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-foreground font-semibold truncate">{name}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(name, "name")}
                className="shrink-0 hover:bg-primary/10"
              >
                {copiedName ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Save Credentials Button */}
        <Button
          variant="outline"
          className="w-full border-border hover:bg-accent animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
          onClick={saveCredentials}
        >
          <Download className="w-4 h-4 mr-2" />
          Save Credentials
        </Button>

        {/* Login Button - Redirects to YouTube */}
        <Button
          className="w-full gradient-cloud text-primary-foreground hover:opacity-90 transition-opacity shadow-cloud animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
          onClick={redirectToYouTube}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Login
        </Button>
      </CardContent>
    </Card>
  );
};

export default SuccessScreen;
