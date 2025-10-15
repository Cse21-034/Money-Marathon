import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AnalyticsCharts } from "@/components/analytics/analytics-charts";
import { TrendingUp, BarChart3, Target, Award, Percent, Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/plans"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/plans");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const plansArray = Array.isArray(data?.plans) ? data.plans : [];
  
  // Calculate statistics
  const totalPlans = plansArray.length;
  const activePlans = plansArray.filter(p => p.status === "active").length;
  const completedPlans = plansArray.filter(p => p.status === "completed").length;
  const stoppedPlans = plansArray.filter(p => p.status === "stopped").length;
  
  const totalInvestment = plansArray.reduce((sum, plan) => 
    sum + parseFloat(plan.startWager), 0
  );
  
  const successRate = totalPlans > 0 
    ? Math.round((completedPlans / totalPlans) * 100) 
    : 0;

  const potentialWinnings = plansArray
    .filter(p => p.status === "active")
    .reduce((sum, plan) => {
      const final = parseFloat(plan.startWager) * Math.pow(parseFloat(plan.odds), plan.days);
      return sum + final;
    }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background pb-24">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <span>Analytics Dashboard</span>
          </h1>
          <p className="text-muted-foreground">
            Track your betting performance, success rate, and trends over time.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl p-4 sm:p-6 border border-blue-500/20">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Plans</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{totalPlans}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl p-4 sm:p-6 border border-green-500/20">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Active Plans</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{activePlans}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl p-4 sm:p-6 border border-purple-500/20">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{completedPlans}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-xl p-4 sm:p-6 border border-orange-500/20">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Percent className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Success Rate</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{successRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Investment</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">
              R {totalInvestment.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Across {totalPlans} plan{totalPlans !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl border border-green-500/20 p-6">
            <p className="text-sm text-muted-foreground mb-2">Potential Winnings</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              R {potentialWinnings.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              From {activePlans} active plan{activePlans !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">ROI Potential</p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600">
              {totalInvestment > 0 
                ? `${((potentialWinnings / totalInvestment - 1) * 100).toFixed(0)}%`
                : '0%'
              }
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Return on Investment
            </p>
          </div>
        </div>

        {/* Your Existing Analytics Charts Component */}
        <AnalyticsCharts plans={plansArray} />

        {/* Plan Status Breakdown */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Plan Status Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Active Plans</span>
                <span className="text-sm font-semibold text-green-600">{activePlans}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600" 
                  style={{ width: `${totalPlans > 0 ? (activePlans / totalPlans) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Completed Plans</span>
                <span className="text-sm font-semibold text-blue-600">{completedPlans}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" 
                  style={{ width: `${totalPlans > 0 ? (completedPlans / totalPlans) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Stopped Plans</span>
                <span className="text-sm font-semibold text-red-600">{stoppedPlans}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-red-500 to-red-600" 
                  style={{ width: `${totalPlans > 0 ? (stoppedPlans / totalPlans) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
