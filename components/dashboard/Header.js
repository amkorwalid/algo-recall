import { SignedIn, UserButton, useUser  } from "@clerk/nextjs";

export default function Header() {
  const { user } = useUser();
  return (
    <header className="bg-blue-600 shadow">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <SignedIn>
            {user?.firstName || "User"}
            <UserButton />
          </SignedIn>
        </div>
        
      </div>
    </header>
  );
}