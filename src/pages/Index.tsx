import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import RegistrationForm from "@/components/RegistrationForm";
import SuccessScreen from "@/components/SuccessScreen";

interface UserData {
  email: string;
  name: string;
}

const AppleLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.48C2.7 15.25 3.66 7.79 9.35 7.69c1.46-.03 2.53.95 3.32.95.78 0 2.22-1.16 3.73-.99 1.28.14 2.23.54 2.85 1.45-2.54 1.54-2.11 5.38.44 6.44-.54 1.57-1.25 3.14-2.64 4.74zM12.03 5.25c.67-1.63 2.7-2.73 2.58-2.67 1.62-.05 2.14 2.15 2.14 2.15-.71 2.37-3.07 3.03-3.07 3.03-.89-2.02.04-3.29-1.65-2.51z"/>
  </svg>
);

const Index = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleSuccess = (data: UserData) => {
    setUserData(data);
  };

  return (
    <div className="min-h-screen bg-card flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-3 md:px-8 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center gap-1">
          <AppleLogo className="w-5 h-5 mb-1 text-foreground" />
          <span className="font-semibold text-xl tracking-tight text-foreground">iCloud</span>
        </div>
        <button className="p-2 hover:bg-accent rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-border">
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-start md:items-center justify-center p-4">
        {userData ? (
          <SuccessScreen email={userData.email} name={userData.name} />
        ) : (
          <RegistrationForm onSuccess={handleSuccess} />
        )}
      </main>

      {/* Footer Text */}
      <footer className="py-6 text-center text-muted-foreground text-sm">
        Privacy Policy | Terms of Use
      </footer>
    </div>
  );
};

export default Index;