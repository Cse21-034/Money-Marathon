import { AnalyticsCharts } from "@/components/analytics/analytics-charts";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">📊 Analytics Overview</h1>
        <p className="text-muted-foreground mb-6">
          Track your betting performance, success rate, and trends over time.
        </p>
        <AnalyticsCharts />
      </div>
    </div>
  );
}
