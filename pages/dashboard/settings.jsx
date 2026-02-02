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
  const [settings, setSettings] = useState({
    // Quiz Settings
    defaultQuizMode: "random",
    questionsPerQuiz: 5,
    timerEnabled: false,
    timerDuration: 30,
    showHintsAutomatically: false,
    
    // Display Settings
    theme: "dark",
    showProgressBar: true,
    
    // Notification Settings
    emailNotifications: true,
    quizReminders: false,
    weeklyProgress: true,
    
    // Privacy Settings
    profileVisibility: "private",
    shareProgress: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
    setSettings({ ...settings, ...savedSettings });
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Save to localStorage
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
      <div className="flex-grow">
        <Header />
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold" style={{ color: '#FAF3E1' }}>
              Settings ⚙️
            </h1>
            <p className="mt-2" style={{ color: '#F5E7C6' }}>
              Customize your AlgoRecall experience
            </p>
          </div>

          {/* Save Message */}
          {saveMessage && (
            <div 
              className="p-4 rounded-lg mb-6 border"
              style={{ 
                backgroundColor: 'rgba(34,197,94,0.15)',
                borderColor: '#22c55e',
                color: '#22c55e'
              }}
            >
              ✅ {saveMessage}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            {/* Tabs Sidebar */}
            <div 
              className="md:w-64 p-4 rounded-lg border"
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
              className="flex-grow p-6 rounded-lg border"
              style={{ 
                backgroundColor: '#2A2A2A',
                borderColor: 'rgba(255,255,255,0.08)'
              }}
            >
              {/* Account Tab */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold" style={{ color: '#FA8112' }}>
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
                        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: '#FA8112', color: '#222222' }}
                      >
                        {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: '#FAF3E1' }}>
                          {user?.firstName || user?.username || "User"}
                        </p>
                        <p className="text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>
                          {user?.primaryEmailAddress?.emailAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium" style={{ color: '#F5E7C6' }}>
                      Account Status
                    </label>
                    <div 
                      className="p-4 rounded-lg border"
                      style={{ 
                        backgroundColor: '#303030',
                        borderColor: 'rgba(255,255,255,0.08)'
                      }}
                    >
                      <p style={{ color: '#F5E7C6' }}>
                        <span style={{ color: '#22c55e' }}>✓</span> Active Account
                      </p>
                      <p className="text-sm mt-1" style={{ color: 'rgba(245,231,198,0.6)' }}>
                        Member since {new Date(user?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push("/user-profile")}
                    className="px-6 py-2 rounded-lg transition duration-300"
                    style={{ backgroundColor: '#FA8112', color: '#222222' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#E9720F'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#FA8112'}
                  >
                    Manage Account with Clerk
                  </button>
                </div>
              )}

              {/* Quiz Tab */}
              {activeTab === "quiz" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold" style={{ color: '#FA8112' }}>
                    Quiz Settings
                  </h2>

                  <div>
                    <label className="block mb-2 font-medium" style={{ color: '#F5E7C6' }}>
                      Default Quiz Mode
                    </label>
                    <select
                      value={settings.defaultQuizMode}
                      onChange={(e) => handleSettingChange("defaultQuizMode", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border transition duration-300"
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
                    <label className="block mb-2 font-medium" style={{ color: '#F5E7C6' }}>
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
                    <div className="flex justify-between text-sm mt-1" style={{ color: 'rgba(245,231,198,0.6)' }}>
                      <span>1</span>
                      <span>20</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium" style={{ color: '#F5E7C6' }}>Enable Timer</p>
                      <p className="text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>
                        Add time pressure to your quizzes
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
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
                      <label className="block mb-2 font-medium" style={{ color: '#F5E7C6' }}>
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
                      <div className="flex justify-between text-sm mt-1" style={{ color: 'rgba(245,231,198,0.6)' }}>
                        <span>10s</span>
                        <span>120s</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium" style={{ color: '#F5E7C6' }}>Show Hints Automatically</p>
                      <p className="text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>
                        Display key insights before checking answer
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
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

              {/* Display Tab */}
              {activeTab === "display" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold" style={{ color: '#FA8112' }}>
                    Display Settings
                  </h2>

                  <div>
                    <label className="block mb-2 font-medium" style={{ color: '#F5E7C6' }}>
                      Theme
                    </label>
                    <select
                      value={settings.theme}
                      onChange={(e) => handleSettingChange("theme", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border transition duration-300"
                      style={{ 
                        backgroundColor: '#303030',
                        color: '#FAF3E1',
                        borderColor: 'rgba(255,255,255,0.08)'
                      }}
                    >
                      <option value="dark">Dark Mode</option>
                      <option value="light" disabled>Light Mode (Coming Soon)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium" style={{ color: '#F5E7C6' }}>Show Progress Bar</p>
                      <p className="text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>
                        Display progress indicator in quizzes
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.showProgressBar}
                        onChange={(e) => handleSettingChange("showProgressBar", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div 
                        className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{ 
                          backgroundColor: settings.showProgressBar ? '#FA8112' : '#303030'
                        }}
                      ></div>
                    </label>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold" style={{ color: '#FA8112' }}>
                    Notification Settings
                  </h2>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium" style={{ color: '#F5E7C6' }}>Email Notifications</p>
                      <p className="text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>
                        Receive updates via email
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div 
                        className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{ 
                          backgroundColor: settings.emailNotifications ? '#FA8112' : '#303030'
                        }}
                      ></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium" style={{ color: '#F5E7C6' }}>Quiz Reminders</p>
                      <p className="text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>
                        Daily reminders to practice
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.quizReminders}
                        onChange={(e) => handleSettingChange("quizReminders", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div 
                        className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{ 
                          backgroundColor: settings.quizReminders ? '#FA8112' : '#303030'
                        }}
                      ></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium" style={{ color: '#F5E7C6' }}>Weekly Progress Report</p>
                      <p className="text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>
                        Summary of your weekly achievements
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.weeklyProgress}
                        onChange={(e) => handleSettingChange("weeklyProgress", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div 
                        className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{ 
                          backgroundColor: settings.weeklyProgress ? '#FA8112' : '#303030'
                        }}
                      ></div>
                    </label>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold" style={{ color: '#FA8112' }}>
                    Privacy Settings
                  </h2>

                  <div>
                    <label className="block mb-2 font-medium" style={{ color: '#F5E7C6' }}>
                      Profile Visibility
                    </label>
                    <select
                      value={settings.profileVisibility}
                      onChange={(e) => handleSettingChange("profileVisibility", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border transition duration-300"
                      style={{ 
                        backgroundColor: '#303030',
                        color: '#FAF3E1',
                        borderColor: 'rgba(255,255,255,0.08)'
                      }}
                    >
                      <option value="private">Private</option>
                      <option value="friends">Friends Only</option>
                      <option value="public">Public</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium" style={{ color: '#F5E7C6' }}>Share Progress</p>
                      <p className="text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>
                        Allow others to see your progress
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.shareProgress}
                        onChange={(e) => handleSettingChange("shareProgress", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div 
                        className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{ 
                          backgroundColor: settings.shareProgress ? '#FA8112' : '#303030'
                        }}
                      ></div>
                    </label>
                  </div>
                </div>
              )}

              {/* Data Tab */}
              {activeTab === "data" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold" style={{ color: '#FA8112' }}>
                    Data Management
                  </h2>

                  <div 
                    className="p-4 rounded-lg border"
                    style={{ 
                      backgroundColor: 'rgba(250,129,18,0.15)',
                      borderColor: 'rgba(250,129,18,0.35)'
                    }}
                  >
                    <p className="text-sm" style={{ color: '#F5E7C6' }}>
                      ⚠️ Warning: These actions are permanent and cannot be undone!
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div 
                      className="p-4 rounded-lg border"
                      style={{ 
                        backgroundColor: '#303030',
                        borderColor: 'rgba(255,255,255,0.08)'
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium" style={{ color: '#F5E7C6' }}>Clear Progress Data</p>
                          <p className="text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>
                            Remove all completed and in-progress problem status
                          </p>
                        </div>
                        <button
                          onClick={() => handleClearData("progress")}
                          className="px-4 py-2 rounded-lg transition duration-300"
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
                          Clear Progress
                        </button>
                      </div>
                    </div>

                    <div 
                      className="p-4 rounded-lg border"
                      style={{ 
                        backgroundColor: '#303030',
                        borderColor: 'rgba(255,255,255,0.08)'
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium" style={{ color: '#F5E7C6' }}>Clear Favorites</p>
                          <p className="text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>
                            Remove all favorite problems
                          </p>
                        </div>
                        <button
                          onClick={() => handleClearData("favorites")}
                          className="px-4 py-2 rounded-lg transition duration-300"
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
                          Clear Favorites
                        </button>
                      </div>
                    </div>

                    <div 
                      className="p-4 rounded-lg border"
                      style={{ 
                        backgroundColor: '#303030',
                        borderColor: 'rgba(255,255,255,0.08)'
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium" style={{ color: '#F5E7C6' }}>Clear Custom Quiz Sets</p>
                          <p className="text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>
                            Remove all saved custom quiz sets
                          </p>
                        </div>
                        <button
                          onClick={() => handleClearData("customSets")}
                          className="px-4 py-2 rounded-lg transition duration-300"
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
                          Clear Sets
                        </button>
                      </div>
                    </div>

                    <div 
                      className="p-4 rounded-lg border"
                      style={{ 
                        backgroundColor: 'rgba(239,68,68,0.1)',
                        borderColor: '#ef4444'
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium" style={{ color: '#ef4444' }}>Clear All Data</p>
                          <p className="text-sm" style={{ color: 'rgba(245,231,198,0.6)' }}>
                            Remove ALL progress, favorites, and settings
                          </p>
                        </div>
                        <button
                          onClick={() => handleClearData("all")}
                          className="px-4 py-2 rounded-lg transition duration-300"
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
                <div className="flex space-x-4 mt-8 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="px-6 py-3 rounded-lg font-medium transition duration-300"
                    style={{ backgroundColor: '#FA8112', color: '#222222' }}
                    onMouseEnter={(e) => !isSaving && (e.target.style.backgroundColor = '#E9720F')}
                    onMouseLeave={(e) => !isSaving && (e.target.style.backgroundColor = '#FA8112')}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleResetSettings}
                    className="px-6 py-3 rounded-lg transition duration-300"
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