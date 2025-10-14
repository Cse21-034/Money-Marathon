import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, Menu, X, Ticket } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function Navbar() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
    
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      window.location.href = "/login";
    },
  });

  return (
    <nav className="bg-card border-b border-border px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-3 cursor-pointer">
          <Link href="/">
            <div className="flex items-center space-x-3">
              <img
                src="https://iili.io/KFIFETg.png"
                alt="Money Marathon Logo"
                className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain"
              />
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                Money Marathon
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/">
            <a className="text-foreground hover:text-primary transition-colors font-medium">
              Dashboard
            </a>
          </Link>
          <Link href="/booking-codes">
            <a className="text-foreground hover:text-primary transition-colors font-medium flex items-center space-x-1">
              <Ticket className="h-4 w-4" />
              <span>Booking Codes</span>
            </a>
          </Link>
          <span className="text-muted-foreground hover:text-primary transition-colors cursor-not-allowed">
            Analytics
          </span>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <span className="hidden sm:block text-sm font-medium">
              {user?.name}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="h-4 w-4" />
          </Button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-3 flex flex-col space-y-3 border-t border-border pt-3">
          <Link href="/">
            <a
              className="text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </a>
          </Link>
          <Link href="/booking-codes">
            <a
              className="text-foreground hover:text-primary transition-colors font-medium flex items-center space-x-1"
              onClick={() => setMenuOpen(false)}
            >
              <Ticket className="h-4 w-4" />
              <span>Booking Codes</span>
            </a>
          </Link>
          <span className="text-muted-foreground cursor-not-allowed">
            Analytics
          </span>
        </div>
      )}
    </nav>
  );
}
