import { useState } from "react";
import CloudBackground from "@/components/CloudBackground";
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
    <main className="min-h-screen gradient-sky flex items-center justify-center p-4 relative">
      <CloudBackground />
      <div className="relative z-10">
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
