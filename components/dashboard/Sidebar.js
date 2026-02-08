import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Sidebar() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: "🏠", path: "/dashboard" },
    { name: "Problems", icon: "📚", path: "/dashboard/problems" },
    { name: "Quiz", icon: "🧠", path: "/dashboard/quiz" },
    // { name: "Progress", icon: "📊", path: "/dashboard/progress" },
    { name: "Favorites", icon: "⭐", path: "/dashboard/favorites" },
    // { name: "Settings", icon: "⚙️", path: "/dashboard/settings" },
  ];

  const isActive = (path) => router.pathname === path;

  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-lg md:hidden transition duration-300"
        style={{ backgroundColor: "#FA8112", color: "#2A2A2A" }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`h-screen flex flex-col border-r transition-all duration-300 fixed md:sticky top-0 z-40
          ${isCollapsed ? "w-20" : "w-64"}
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
        style={{
          backgroundColor: "#2A2A2A",
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        {/* Logo / Brand */}
        <div
          className="p-6 border-b flex items-center justify-between"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          {!isCollapsed && (
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "#FA8112" }}>
                AlgoRecall
              </h2>
              <p className="text-xs" style={{ color: "rgba(245,231,198,0.6)" }}>
                Master Algorithms
              </p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg transition duration-300 hidden md:block"
            style={{ backgroundColor: "#303030" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FA8112")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#303030")}
          >
            <span className="text-lg">{isCollapsed ? "→" : "←"}</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-2 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  onClick={handleMobileNavClick}
                  className={`flex items-center px-4 py-3 rounded-lg transition duration-300 ${
                    isActive(item.path) ? "shadow-lg" : ""
                  }`}
                  style={{
                    backgroundColor: isActive(item.path)
                      ? "#FA8112"
                      : "transparent",
                    color: isActive(item.path) ? "#222222" : "#F5E7C6",
                    display: "flex",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.backgroundColor = "#303030";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <span className="text-2xl">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer / Help Section */}
        <div
          className="p-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          {!isCollapsed ? (
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: "rgba(250,129,18,0.15)" }}
            >
              <p className="text-sm font-semibold" style={{ color: "#FA8112" }}>
                💡 Need Help?
              </p>
              <p className="text-xs mt-1" style={{ color: "#F5E7C6" }}>
                Check out our guides and tutorials.
              </p>
              <button
                className="mt-3 w-full py-2 rounded-lg text-sm font-medium transition duration-300"
                style={{ backgroundColor: "#FA8112", color: "#222222" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#E9720F")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#FA8112")
                }
              >
                Learn More
              </button>
            </div>
          ) : (
            <button
              className="w-full p-3 rounded-lg transition duration-300"
              style={{ backgroundColor: "#303030" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#FA8112")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#303030")
              }
            >
              <span className="text-xl">❓</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}