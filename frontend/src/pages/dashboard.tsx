// frontend/src/pages/dashboard.tsx - WITH ANALYTICS
import { StatsCards } from "@/components/dashboard/stats-cards";
import { PlanCard } from "@/components/dashboard/plan-card";
import { CreatePlanForm } from "@/components/dashboard/create-plan-form";
import { AnalyticsCharts } from "@/components/analytics/analytics-charts";
import { usePlans } from "@/hooks/use-plans";
import { Plus, Sparkles, TrendingUp, Zap, ChevronRight, Bell, Gift, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

// 🎯 Featured Banner Carousel
function FeaturedBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners = [
    {
      gradient: "from-purple-500 via-pink-500 to-red-500",
      icon: "🎁",
      title: "Welcome Bonus",
      subtitle: "Get 100% match on first deposit",
      cta: "Claim Now"
    },
    {
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      icon: "⚡",
      title: "Lightning Wins",
      subtitle: "Daily jackpot opportunities",
      cta: "Play Now"
    },
    {
      gradient: "from-orange-500 via-red-500 to-pink-500",
      icon: "🔥",
      title: "Hot Streaks",
      subtitle: "Track your winning momentum",
      cta: "View Stats"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl mb-6">
      <div className="relative h-40 sm:h-48">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ${
              index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className={`h-full bg-gradient-to-br ${banner.gradient} p-6 flex flex-col justify-between`}>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="text-4xl mb-2">{banner.icon}</div>
                  <h3 className="text-white font-bold text-xl sm:text-2xl">
                    {banner.title}
                  </h3>
                  <p className="text-white/90 text-sm">{banner.subtitle}</p>
                </div>
                <Button 
                  size="sm" 
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                >
                  {banner.cta}
                </Button>
              </div>
              
              {/* Progress Dots */}
              <div className="flex space-x-2 justify-center">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentIndex ? "w-8 bg-white" : "w-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 💼 Rotating Affiliate Banners
function AffiliateBanners() {
  const [currentBanner, setCurrentBanner] = useState(0);

  const affiliates = [
    {
      name: "Deriv",
      logo: "https://iili.io/KFIn5Ga.png",
      gradient: "from-red-500/20 via-orange-500/10 to-yellow-500/5",
      borderColor: "border-red-500/30",
      title: "Trade Smarter with Deriv",
      subtitle: "Get $10,000 virtual funds to practice",
      cta: "Start Trading",
      link: "https://track.deriv.com/_-1DpJjc-4Uj1k0YPxVS0A2Nd7ZgqdRLk/1/",
      bgImage: "https://iili.io/KFRQEIR.jpg"
    },
    {
      name: "Betway",
      logo: "https://iili.io/KFIn5Ga.png",
      gradient: "from-green-500/20 via-emerald-500/10 to-teal-500/5",
      borderColor: "border-green-500/30",
      title: "Bet Big, Win Bigger",
      subtitle: "100% Welcome Bonus up to R1000",
      cta: "Claim Bonus",
      link: "#",
      bgImage: null
    },
    {
      name: "1xBet",
      logo: "https://iili.io/KFIn5Ga.png",
      gradient: "from-blue-500/20 via-indigo-500/10 to-purple-500/5",
      borderColor: "border-blue-500/30",
      title: "Premium Sports Betting",
      subtitle: "Live betting on 1000+ events daily",
      cta: "Join Now",
      link: "#",
      bgImage: null
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % affiliates.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentAffiliate = affiliates[currentBanner];

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-muted-foreground flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>Featured Partners</span>
        </h3>
        <div className="flex space-x-1.5">
          {affiliates.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentBanner 
                  ? "w-6 bg-primary" 
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`View partner ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl">
        {affiliates.map((affiliate, index) => (
          <a
            key={index}
            href={affiliate.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`block transition-all duration-700 ${
              index === currentBanner 
                ? "opacity-100 relative" 
                : "opacity-0 absolute inset-0 pointer-events-none"
            }`}
          >
            {affiliate.bgImage ? (
              // Banner with background image
              <div className="relative h-32 sm:h-40 overflow-hidden group">
                <img
                  src={affiliate.bgImage}
                  alt={affiliate.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent">
                  <div className="h-full flex items-center justify-between p-4 sm:p-6">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <img
                          src={affiliate.logo}
                          alt={affiliate.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover shadow-lg"
                        />
                        <div>
                          <h4 className="text-white font-bold text-base sm:text-lg">
                            {affiliate.title}
                          </h4>
                          <p className="text-white/90 text-xs sm:text-sm">
                            {affiliate.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-white text-black hover:bg-white/90 font-semibold shadow-lg hidden sm:flex"
                    >
                      {affiliate.cta}
                    </Button>
                  </div>
                </div>
                {/* Mobile CTA */}
                <div className="absolute bottom-3 right-3 sm:hidden">
                  <Button size="sm" className="bg-white text-black hover:bg-white/90 font-semibold shadow-lg text-xs">
                    {affiliate.cta}
                  </Button>
                </div>
              </div>
            ) : (
              // Banner with gradient background
              <div className={`bg-gradient-to-br ${affiliate.gradient} border-2 ${affiliate.borderColor} rounded-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 group`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/20 rounded-xl blur-md"></div>
                      <img
                        src={affiliate.logo}
                        alt={affiliate.name}
                        className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover shadow-lg border-2 border-white/20"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground text-sm sm:text-base mb-1 truncate">
                        {affiliate.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {affiliate.subtitle}
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="ml-3 bg-background/50 backdrop-blur-sm hover:bg-background/70 border-2 font-semibold group-hover:scale-105 transition-transform text-xs sm:text-sm"
                  >
                    {affiliate.cta}
                  </Button>
                </div>
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

// 🎨 Quick Actions Grid
function QuickActions({ onCreatePlan }: { onCreatePlan: () => void }) {
  const actions = [
    { icon: Plus, label: "New Plan", color: "bg-blue-500", action: onCreatePlan },
    { icon: TrendingUp, label: "Analytics", color: "bg-green-500" },
    { icon: Zap, label: "Quick Bet", color: "bg-yellow-500" },
    { icon: Gift, label: "Rewards", color: "bg-purple-500" }
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.action}
          className="flex flex-col items-center space-y-2 p-4 rounded-2xl bg-card border border-border hover:shadow-lg transition-all active:scale-95"
        >
          <div className={`${action.color} w-12 h-12 rounded-full flex items-center justify-center shadow-lg`}>
            <action.icon className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-medium text-foreground">{action.label}</span>
        </button>
      ))}
    </div>
  );
}

// 📊 Mini Stats Row
function MiniStats({ plans }: { plans: any[] }) {
  const activePlans = plans.filter(p => p.status === "active").length;
  const totalInvestment = plans.reduce((sum, p) => sum + parseFloat(p.startWager), 0);
  const potentialWin = plans
    .filter(p => p.status === "active")
    .reduce((sum, p) => sum + parseFloat(p.startWager) * Math.pow(parseFloat(p.odds), p.days), 0);

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl p-3 border border-blue-500/20">
        <p className="text-xs text-muted-foreground mb-1">Active</p>
        <p className="text-2xl font-bold text-blue-600">{activePlans}</p>
      </div>
      <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl p-3 border border-green-500/20">
        <p className="text-xs text-muted-foreground mb-1">Invested</p>
        <p className="text-sm font-bold text-green-600">R{(totalInvestment / 1000).toFixed(1)}K</p>
      </div>
      <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl p-3 border border-purple-500/20">
        <p className="text-xs text-muted-foreground mb-1">Potential</p>
        <p className="text-sm font-bold text-purple-600">R{(potentialWin / 1000).toFixed(1)}K</p>
      </div>
    </div>
  );
}

// 🏆 Achievement Badge
function AchievementBanner() {
  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl p-4 mb-6 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="text-white font-bold text-sm">5-Day Streak! 🔥</h4>
          <p className="text-white/90 text-xs">Keep going to unlock VIP rewards</p>
        </div>
        <ChevronRight className="h-5 w-5 text-white/80" />
      </div>
    </div>
  );
}

// 🎯 Floating Action Button
function FloatingActionButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-4 z-40 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
    >
      <Plus className="h-6 w-6 text-white" />
    </button>
  );
}

// 📱 Main Dashboard Component
export default function Dashboard() {
  const { data, isLoading } = usePlans();
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground animate-pulse">Loading your marathon...</p>
        </div>
      </div>
    );
  }

  const plansArray = Array.isArray(data?.plans) ? data.plans : [];
  const activePlans = plansArray.filter((plan: any) => plan.status === "active");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Header with Greeting */}
      <div className="bg-background/80 backdrop-blur-lg border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Hello, {user?.name?.split(" ")[0] || "Champion"} 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              Ready to build your fortune?
            </p>
          </div>
          <button className="relative">
            <Bell className="h-6 w-6 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 pb-32 space-y-6">
        {/* Featured Banner */}
        <FeaturedBanner />

        {/* Quick Actions */}
        <QuickActions onCreatePlan={() => setShowCreateForm(true)} />

        {/* Mini Stats */}
        <MiniStats plans={plansArray} />

        {/* Achievement Banner */}
        {activePlans.length > 0 && <AchievementBanner />}

        {/* Active Plans Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Active Plans</span>
            </h2>
            {activePlans.length > 0 && (
              <button className="text-sm text-primary font-medium flex items-center space-x-1">
                <span>View All</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {activePlans.length > 0 ? (
            <div className="space-y-4">
              {activePlans.map((plan: any) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-dashed border-border p-8 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Start Your First Marathon
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create a plan and watch your wealth compound exponentially
              </p>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Plan
              </Button>
            </div>
          )}
        </div>

        {/* Analytics Charts Section */}
        {plansArray.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Performance Analytics</span>
              </h2>
              <button className="text-sm text-primary font-medium flex items-center space-x-1">
                <span>View Full Analytics</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <AnalyticsCharts plans={plansArray} />
          </div>
        )}

        {/* Rotating Affiliate Banners */}
        <AffiliateBanners />
      </div>

      {/* Create Plan Modal/Sheet */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-background w-full sm:max-w-2xl sm:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background z-10 px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-xl font-bold">Create New Plan</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <CreatePlanForm onSuccess={() => setShowCreateForm(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setShowCreateForm(true)} />

      {/* Bottom Ad Banner 
      <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-border p-3 z-30">
        <a
          href="https://track.deriv.com/_-1DpJjc-4Uj1k0YPxVS0A2Nd7ZgqdRLk/1/"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src="https://iili.io/KFRQEIR.jpg"
            alt="Sponsor"
            className="w-full h-16 object-contain rounded-lg"
          />
        </a>
      </div>*/}
    </div>
  );
}
