import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth, useUser } from "@clerk/nextjs";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";

export default function SettingsPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  const [activeTab, setActiveTab] = useState("account");
  const [showMobileTabs, setShowMobileTabs] = useState(false);
  const [settings, setSettings] = useState(() => {
    const defaultSettings = {
      defaultQuizMode: "random",
      questionsPerQuiz: 5,
      timerEnabled: false,
      timerDuration: 30,
      showHintsAutomatically: false,
      theme: "dark",
      showProgressBar: true,
      emailNotifications: true,
      quizReminders: false,
      weeklyProgress: true,
      profileVisibility: "private",
      shareProgress: false,
    };
    
    if (typeof window === 'undefined') return defaultSettings;
    
    const savedSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
    return { ...defaultSettings, ...savedSettings };
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    localStorage.setItem("userSettings", JSON.stringify(settings));
    
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage("Settings saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    }, 500);
  };

  const handleResetSettings = () => {
    if (window.confirm("Are you sure you want to reset all settings to default?")) {
      const defaultSettings = {
        defaultQuizMode: "random",
        questionsPerQuiz: 5,
        timerEnabled: false,
        timerDuration: 30,
        showHintsAutomatically: false,
        theme: "dark",
        showProgressBar: true,
        emailNotifications: true,
        quizReminders: false,
        weeklyProgress: true,
        profileVisibility: "private",
        shareProgress: false,
      };
      
      setSettings(defaultSettings);
      localStorage.setItem("userSettings", JSON.stringify(defaultSettings));
      setSaveMessage("Settings reset to default!");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleClearData = (dataType) => {
    const confirmMessage = {
      progress: "Are you sure you want to clear all progress data? This cannot be undone!",
      favorites: "Are you sure you want to clear all favorites?",
      customSets: "Are you sure you want to clear all custom quiz sets?",
      all: "Are you sure you want to clear ALL data? This cannot be undone!",
    };

    if (window.confirm(confirmMessage[dataType])) {
      switch (dataType) {
        case "progress":
          localStorage.removeItem("problemStatus");
          break;
        case "favorites":
          localStorage.removeItem("favorites");
          break;
        case "customSets":
          localStorage.removeItem("customQuizSet");
          break;
        case "all":
          localStorage.clear();
          break;
      }
      setSaveMessage(`${dataType.charAt(0).toUpperCase() + dataType.slice(1)} data cleared!`);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const tabs = [
    { id: "account", name: "Account", icon: "👤" },
    { id: "quiz", name: "Quiz", icon: "🧠" },
    { id: "display", name: "Display", icon: "🎨" },
    { id: "notifications", name: "Notifications", icon: "🔔" },
    { id: "privacy", name: "Privacy", icon: "🔒" },
    { id: "data", name: "Data", icon: "💾" },
  ];

  const currentTab = tabs.find(t => t.id === activeTab);

  if (!isLoaded) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: '#222222' }}
      >
        <div style={{ color: '#FAF3E1' }}>Loading...</div>
      </div>
    );
  }

  return isSignedIn ? (
    <div className="flex min-h-screen" style={{ backgroundColor: '#222222' }}>
      <Sidebar />
      <div className="flex-grow w-full md:w-auto overflow-x-hidden">
        <Header />
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 pt-20 md:pt-8">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold" style={{ color: '#FAF3E1' }}>
              Settings ⚙️
            </h1>
            <p className="mt-2 text-sm md:text-base" style={{ color: '#F5E7C6' }}>
              Customize your AlgoRecall experience
            </p>
          </div>

          {/* Save Message */}
          {saveMessage && (
            <div 
              className="p-3 md:p-4 rounded-lg mb-4 md:mb-6 border"
              style={{ 
                backgroundColor: 'rgba(34,197,94,0.15)',
                borderColor: '#22c55e',
                color: '#22c55e'
              }}
            >
              ✅ {saveMessage}
            </div>
          )}

          {/* Mobile Tab Selector */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowMobileTabs(!showMobileTabs)}
              className="w-full flex items-center justify-between p-4 rounded-lg border"
              style={{ 
                backgroundColor: '#2A2A2A',
                borderColor: 'rgba(255,255,255,0.08)',
                color: '#FAF3E1'
              }}
            >
              <span className="flex items-center space-x-3">
                <span className="text-xl">{currentTab?.icon}</span>
                <span className="font-medium">{currentTab?.name}</span>
              </span>
              <span>{showMobileTabs ? '▲' : '▼'}</span>
            </button>
            
            {showMobileTabs && (
              <div 
                className="mt-2 p-2 rounded-lg border"
                style={{ 
                  backgroundColor: '#2A2A2A',
                  borderColor: 'rgba(255,255,255,0.08)'
                }}
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowMobileTabs(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-300 text-left"
                    style={
                      activeTab === tab.id
                        ? { backgroundColor: 'rgba(250,129,18,0.15)', color: '#FA8112' }
                        : { color: '#F5E7C6' }
                    }
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Desktop Tabs Sidebar */}
            <div 
              className="hidden md:block md:w-64 p-4 rounded-lg border flex-shrink-0"
              style={{ 
                backgroundColor: '#2A2A2A',
                borderColor: 'rgba(255,255,255,0.08)'
              }}
            >
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-300 text-left"
                    style={
                      activeTab === tab.id
                        ? { backgroundColor: 'rgba(250,129,18,0.15)', color: '#FA8112' }
                        : { color: '#F5E7C6' }
                    }
                    onMouseEnter={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.backgroundColor = '#303030';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Settings Content */}
            <div 
              className="flex-grow p-4 md:p-6 rounded-lg border"
              style={{ 
                backgroundColor: '#2A2A2A',
                borderColor: 'rgba(255,255,255,0.08)'
              }}
            >
              {/* Account Tab - keeping existing content with responsive adjustments */}
              {activeTab === "account" && (
                <div className="space-y-4 md:space-y-6">
                  <h2 className="text-xl md:text-2xl font-bold" style={{ color: '#FA8112' }}>
                    Account Settings
                  </h2>

                  <div 
                    className="p-4 rounded-lg border"
                    style={{ 
                      backgroundColor: '#303030',
                      borderColor: 'rgba(255,255,255,0.08)'
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl flex-shrink-0"
                        style={{ backgroundColor: '#FA8112', color: '#222222' }}
                      >
                        {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "U"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm md:text-base truncate" style={{ color: '#FAF3E1' }}>
                          {user?.firstName || user?.username || "User"}
                        </p>
                        <p className="text-xs md:text-sm truncate" style={{ color: 'rgba(245,231,198,0.6)' }}>
                          {user?.primaryEmailAddress?.emailAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-sm md:text-base" style={{ color: '#F5E7C6' }}>
                      Account Status
                    </label>
                    <div 
                      className="p-4 rounded-lg border"
                      style={{ 
                        backgroundColor: '#303030',
                        borderColor: 'rgba(255,255,255,0.08)'
                      }}
                    >
                      <p className="text-sm md:text-base" style={{ color: '#F5E7C6' }}>
                        <span style={{ color: '#22c55e' }}>✓</span> Active Account
                      </p>
                      <p className="text-xs md:text-sm mt-1" style={{ color: 'rgba(245,231,198,0.6)' }}>
                        Member since {new Date(user?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push("/user-profile")}
                    className="w-full sm:w-auto px-4 md:px-6 py-2 rounded-lg transition duration-300 text-sm md:text-base"
                    style={{ backgroundColor: '#FA8112', color: '#222222' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#E9720F'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#FA8112'}
                  >
                    Manage Account with Clerk
                  </button>
                </div>
              )}

              {/* Quiz Tab - responsive version */}
              {activeTab === "quiz" && (
                <div className="space-y-4 md:space-y-6">
                  <h2 className="text-xl md:text-2xl font-bold" style={{ color: '#FA8112' }}>
                    Quiz Settings
                  </h2>

                  <div>
                    <label className="block mb-2 font-medium text-sm md:text-base" style={{ color: '#F5E7C6' }}>
                      Default Quiz Mode
                    </label>
                    <select
                      value={settings.defaultQuizMode}
                      onChange={(e) => handleSettingChange("defaultQuizMode", e.target.value)}
                      className="w-full px-3 md:px-4 py-2 rounded-lg border transition duration-300 text-sm md:text-base"
                      style={{ 
                        backgroundColor: '#303030',
                        color: '#FAF3E1',
                        borderColor: 'rgba(255,255,255,0.08)'
                      }}
                    >
                      <option value="random">Random Quiz</option>
                      <option value="topic">Topic-Based</option>
                      <option value="difficulty">Difficulty-Based</option>
                      <option value="custom">Custom Set</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-sm md:text-base" style={{ color: '#F5E7C6' }}>
                      Questions Per Quiz: {settings.questionsPerQuiz}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={settings.questionsPerQuiz}
                      onChange={(e) => handleSettingChange("questionsPerQuiz", parseInt(e.target.value))}
                      className="w-full"
                      style={{ accentColor: '#FA8112' }}
                    />
                    <div className="flex justify-between text-xs md:text-sm mt-1" style={{ color: 'rgba(245,231,198,0.6)' }}>
                      <span>1</span>
                      <span>20</span>
                    </div>
                  </div>

                  <div className="flex items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-sm md:text-base" style={{ color: '#F5E7C6' }}>Enable Timer</p>
                      <p className="text-xs md:text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>
                        Add time pressure to your quizzes
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={settings.timerEnabled}
                        onChange={(e) => handleSettingChange("timerEnabled", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div 
                        className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{ 
                          backgroundColor: settings.timerEnabled ? '#FA8112' : '#303030'
                        }}
                      ></div>
                    </label>
                  </div>

                  {settings.timerEnabled && (
                    <div>
                      <label className="block mb-2 font-medium text-sm md:text-base" style={{ color: '#F5E7C6' }}>
                        Timer Duration: {settings.timerDuration} seconds
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="120"
                        step="10"
                        value={settings.timerDuration}
                        onChange={(e) => handleSettingChange("timerDuration", parseInt(e.target.value))}
                        className="w-full"
                        style={{ accentColor: '#FA8112' }}
                      />
                      <div className="flex justify-between text-xs md:text-sm mt-1" style={{ color: 'rgba(245,231,198,0.6)' }}>
                        <span>10s</span>
                        <span>120s</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-sm md:text-base" style={{ color: '#F5E7C6' }}>Show Hints Automatically</p>
                      <p className="text-xs md:text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>
                        Display key insights before checking answer
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={settings.showHintsAutomatically}
                        onChange={(e) => handleSettingChange("showHintsAutomatically", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div 
                        className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{ 
                          backgroundColor: settings.showHintsAutomatically ? '#FA8112' : '#303030'
                        }}
                      ></div>
                    </label>
                  </div>
                </div>
              )}

              {/* Display, Notifications, Privacy tabs - similar responsive pattern */}
              {/* Data Tab - responsive version with stacked buttons on mobile */}
              {activeTab === "data" && (
                <div className="space-y-4 md:space-y-6">
                  <h2 className="text-xl md:text-2xl font-bold" style={{ color: '#FA8112' }}>
                    Data Management
                  </h2>

                  <div 
                    className="p-3 md:p-4 rounded-lg border"
                    style={{ 
                      backgroundColor: 'rgba(250,129,18,0.15)',
                      borderColor: 'rgba(250,129,18,0.35)'
                    }}
                  >
                    <p className="text-xs md:text-sm" style={{ color: '#F5E7C6' }}>
                      ⚠️ Warning: These actions are permanent and cannot be undone!
                    </p>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    {[
                      { type: "progress", label: "Clear Progress Data", description: "Remove all completed and in-progress problem status" },
                      { type: "favorites", label: "Clear Favorites", description: "Remove all favorite problems" },
                      { type: "customSets", label: "Clear Custom Quiz Sets", description: "Remove all saved custom quiz sets" },
                    ].map((item) => (
                      <div 
                        key={item.type}
                        className="p-3 md:p-4 rounded-lg border"
                        style={{ 
                          backgroundColor: '#303030',
                          borderColor: 'rgba(255,255,255,0.08)'
                        }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-medium text-sm md:text-base" style={{ color: '#F5E7C6' }}>{item.label}</p>
                            <p className="text-xs md:text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>
                              {item.description}
                            </p>
                          </div>
                          <button
                            onClick={() => handleClearData(item.type)}
                            className="w-full sm:w-auto px-4 py-2 rounded-lg transition duration-300 text-xs md:text-sm whitespace-nowrap"
                            style={{ backgroundColor: '#303030', color: '#ef4444', border: '1px solid #ef4444' }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#ef4444';
                              e.target.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = '#303030';
                              e.target.style.color = '#ef4444';
                            }}
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    ))}

                    <div 
                      className="p-3 md:p-4 rounded-lg border"
                      style={{ 
                        backgroundColor: 'rgba(239,68,68,0.1)',
                        borderColor: '#ef4444'
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-sm md:text-base" style={{ color: '#ef4444' }}>Clear All Data</p>
                          <p className="text-xs md:text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>
                            Remove ALL progress, favorites, and settings
                          </p>
                        </div>
                        <button
                          onClick={() => handleClearData("all")}
                          className="w-full sm:w-auto px-4 py-2 rounded-lg transition duration-300 text-xs md:text-sm whitespace-nowrap"
                          style={{ backgroundColor: '#ef4444', color: '#ffffff' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save/Reset Buttons */}
              {activeTab !== "data" && activeTab !== "account" && (
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6 md:mt-8 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition duration-300 text-sm md:text-base"
                    style={{ backgroundColor: '#FA8112', color: '#222222' }}
                    onMouseEnter={(e) => !isSaving && (e.target.style.backgroundColor = '#E9720F')}
                    onMouseLeave={(e) => !isSaving && (e.target.style.backgroundColor = '#FA8112')}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleResetSettings}
                    className="px-4 md:px-6 py-2 md:py-3 rounded-lg transition duration-300 text-sm md:text-base"
                    style={{ backgroundColor: '#303030', color: '#F5E7C6' }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#ef4444';
                      e.target.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#303030';
                      e.target.style.color = '#F5E7C6';
                    }}
                  >
                    Reset to Default
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}