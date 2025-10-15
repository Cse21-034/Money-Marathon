import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { TrendingUp, BarChart3, Target, Award, Calendar, Percent } from "lucide-react";

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
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
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
  
  const avgOdds = totalPlans > 0 
    ? plansArray.reduce((sum, plan) => sum + parseFloat(plan.odds), 0) / totalPlans 
    : 0;
  
  const successRate = totalPlans > 0 
    ? Math.round((completedPlans / totalPlans) * 100) 
    : 0;

  const potentialWinnings = plansArray
    .filter(p => p.status === "active")
    .reduce((sum, plan) => {
      const final = parseFloat(plan.startWager) * Math.pow(parseFloat(plan.odds), plan.days);
      return sum + final;
    }, 0);

  // Calculate success rates for each plan
  const planStats = plansArray.map(plan => ({
    name: plan.name,
    status: plan.status,
    successRate: plan.status === "completed" ? 100 : plan.status === "stopped" ? 0 : 50
  }));

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
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Plans</p>
                <p className="text-2xl font-bold text-foreground">{totalPlans}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Plans</p>
                <p className="text-2xl font-bold text-foreground">{activePlans}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">{completedPlans}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-xl p-6 border border-orange-500/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Percent className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-foreground">{successRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Financial Overview</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Total Investment</span>
                <span className="text-lg font-bold text-foreground">
                  R {totalInvestment.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-lg border border-green-500/20">
                <span className="text-sm text-muted-foreground">Potential Winnings</span>
                <span className="text-lg font-bold text-green-600">
                  R {potentialWinnings.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Average Odds</span>
                <span className="text-lg font-bold text-foreground">
                  {avgOdds.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Plan Status Breakdown</span>
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Active Plans</span>
                  <span className="text-sm font-semibold">{activePlans}</span>
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
                  <span className="text-sm font-semibold">{completedPlans}</span>
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
                  <span className="text-sm font-semibold">{stoppedPlans}</span>
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

        {/* Plan Performance */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Award className="h-5 w-5 text-primary" />
            <span>Plan Performance</span>
          </h3>
          <div className="space-y-4">
            {planStats.length > 0 ? (
              planStats.map((plan, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      plan.status === "completed" ? "bg-blue-500/20" :
                      plan.status === "active" ? "bg-green-500/20" :
                      "bg-red-500/20"
                    }`}>
                      {plan.status === "completed" ? "✅" :
                       plan.status === "active" ? "🟢" : "🔴"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {plan.name}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {plan.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 ml-4">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          plan.successRate >= 80 ? "bg-green-500" : 
                          plan.successRate >= 50 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${plan.successRate}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-foreground min-w-[3rem] text-right">
                      {plan.successRate}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No plans yet</p>
                <p className="text-sm">Create your first plan to see analytics and performance data.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
