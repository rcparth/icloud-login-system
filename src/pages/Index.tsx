import { useState } from "react";
import { Cloud, MoreHorizontal } from "lucide-react";
import RegistrationForm from "@/components/RegistrationForm";
import SuccessScreen from "@/components/SuccessScreen";

interface UserData {
  email: string;
  name: string;
}

const Index = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleSuccess = (data: UserData) => {
    setUserData(data);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-1.5">
          <Cloud className="w-5 h-5 text-foreground" strokeWidth={1.5} />
          <span className="text-lg font-medium text-foreground">iCloud</span>
        </div>
        <button className="p-2 rounded-full hover:bg-accent transition-colors">
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 pt-8 pb-16">
        {userData ? (
          <SuccessScreen email={userData.email} name={userData.name} />
        ) : (
          <RegistrationForm onSuccess={handleSuccess} />
        )}
      </div>
    </main>
  );
};

export default Index;
