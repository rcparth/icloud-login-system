interface SuccessScreenProps {
  email: string;
  name: string;
}

const SuccessScreen = ({ email, name }: SuccessScreenProps) => {
  return (
    <div className="w-full max-w-md bg-card rounded-2xl shadow-card p-8 animate-scale-in">
      <div className="flex flex-col items-center">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-foreground tracking-tight mb-6">
          Show credentials
        </h1>

        {/* Credentials Only */}
        <div className="w-full space-y-4 text-center">
          <p className="text-base text-foreground">
            <span className="font-medium">New ID: email</span>
            <span className="text-muted-foreground"> - </span>
            <span className="font-semibold">{email}</span>
          </p>

          <p className="text-base text-foreground">
            <span className="font-medium">name:</span>
            <span className="text-muted-foreground"> - </span>
            <span className="font-semibold">{name}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
