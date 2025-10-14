// frontend/src/components/layout/navbar.tsx - REDESIGNED
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Ticket, BarChart3, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function Navbar() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location] = useLocation();
  const [showProfile, setShowProfile] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      localStorage.removeItem("jwt_token");
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "👋 See you soon!",
        description: "You've been logged out successfully.",
      });
      window.location.href = "/";
    },
  });

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/booking-codes", icon: Ticket, label: "Codes" },
    { path: "/analytics", icon: BarChart3, label: "Stats" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <>
      {/* Top Header - Simple and Clean */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <img
                src="https://iili.io/KFIFETg.png"
                alt="Money Marathon"
                className="h-10 w-10 rounded-xl object-cover shadow-lg"
              />
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Money Marathon
              </span>
            </div>
          </Link>

          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full pl-3 pr-4 py-2 border border-primary/20 hover:shadow-lg transition-all"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="text-sm font-medium text-foreground hidden sm:block">
              {user?.name?.split(" ")[0] || "User"}
            </span>
          </button>
        </div>
      </header>

      {/* Bottom Navigation - Mobile First */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border pb-safe">
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => {
              const isActive = location === item.path;
              const Icon = item.icon;
              
              return (
                <Link key={item.path} href={item.path}>
                  <button
                    className={`flex flex-col items-center justify-center space-y-1 px-4 py-2 rounded-2xl transition-all ${
                      isActive
                        ? "bg-gradient-to-br from-primary/20 to-primary/5 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="relative">
                      <Icon className={`h-6 w-6 ${isActive ? "scale-110" : ""} transition-transform`} />
                      {isActive && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                      )}
                    </div>
                    <span className={`text-xs font-medium ${isActive ? "font-bold" : ""}`}>
                      {item.label}
                    </span>
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Profile Dropdown */}
      {showProfile && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowProfile(false)}>
          <div className="absolute top-20 right-4 bg-background rounded-2xl shadow-2xl border border-border w-64 overflow-hidden"
               onClick={(e) => e.stopPropagation()}>
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-6 border-b border-border">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground truncate">{user?.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              <div className="bg-background/50 backdrop-blur-sm rounded-lg p-2">
                <p className="text-xs text-muted-foreground mb-1">Member Since</p>
                <p className="text-sm font-semibold text-foreground">October 2024</p>
              </div>
            </div>

            {/* Profile Menu */}
            <div className="p-2">
              <Link href="/profile">
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors text-left">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">My Profile</span>
                </button>
              </Link>
              <Link href="/analytics">
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors text-left">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Analytics</span>
                </button>
              </Link>
              <button
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors text-left text-red-600"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
