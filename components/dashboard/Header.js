import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  const { user } = useUser();
  console.log("User ID:", user.id);

  return (
    <header 
      className="shadow-md border-b w-full"
      style={{ 
        backgroundColor: '#2A2A2A',
        borderColor: 'rgba(255,255,255,0.08)',
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
      }}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Page Title / Greeting */}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#FAF3E1' }}>
            AlgoRecall
          </h1>
          {user && (
            <p className="text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>
              Welcome back, {user.firstName || 'User'}!
            </p>
          )}
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications (optional placeholder) */}
          {/* <button 
            className="relative p-2 rounded-lg transition duration-300"
            style={{ backgroundColor: '#303030' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FA8112'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#303030'}
          >
            <span className="text-xl">🔔</span>
            {/* Notification badge */}
            {/* <span 
              className="absolute top-0 right-0 w-3 h-3 rounded-full"
              style={{ backgroundColor: '#FA8112' }}
            ></span>
          </button> */} 

          {/* Settings */}
          {/* <Link href="/dashboard/settings">
            <button 
              className="p-2 rounded-lg transition duration-300"
              style={{ backgroundColor: '#303030' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FA8112'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#303030'}
            >
              <span className="text-xl">⚙️</span>
            </button>
          </Link> */}
          {/* User Profile Button (Clerk) */}
          <div className="flex items-center">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-16 h-16 rounded-full border-2",
                  userButtonPopoverCard: {
                    backgroundColor: '#303030',
                    color: '#FAF3E1',
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}