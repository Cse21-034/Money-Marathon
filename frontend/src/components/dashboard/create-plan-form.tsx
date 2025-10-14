// frontend/src/components/dashboard/create-plan-form.tsx - REDESIGNED
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertPlanSchema, type InsertPlan } from "@/types/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Rocket, Target, Zap, TrendingUp, AlertCircle, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface CreatePlanFormProps {
  onSuccess?: () => void;
}

export function CreatePlanForm({ onSuccess }: CreatePlanFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [estimatedWinnings, setEstimatedWinnings] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InsertPlan>({
    resolver: zodResolver(insertPlanSchema),
    defaultValues: {
      name: "",
      startWager: 100,
      odds: 1.5,
      days: 30,
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    const { startWager, odds, days } = watchedValues;
    if (startWager && odds && days) {
      const final = startWager * Math.pow(odds, days);
      setEstimatedWinnings(final);
    }
  }, [watchedValues]);

  const createPlanMutation = useMutation({
    mutationFn: async (data: InsertPlan) => {
      const response = await apiRequest("POST", "/api/plans", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plans"] });
      toast({
        title: "🎉 Plan Created!",
        description: "Your betting marathon has begun!",
        duration: 3000,
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPlan) => {
    createPlanMutation.mutate(data);
  };

  const multiplierEffect = watchedValues.odds && watchedValues.days
    ? ((estimatedWinnings / (watchedValues.startWager || 100)) - 1) * 100
    : 0;

  const durationOptions = [
    { value: 15, label: "15 Days", subtitle: "Sprint", icon: "⚡" },
    { value: 30, label: "30 Days", subtitle: "Standard", icon: "🎯" },
    { value: 45, label: "45 Days", subtitle: "Extended", icon: "🚀" },
    { value: 60, label: "60 Days", subtitle: "Marathon", icon: "🏆" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Rocket className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-1">Create Your Plan</h3>
        <p className="text-sm text-muted-foreground">
          Start your compound betting journey
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Plan Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center space-x-2 text-sm font-semibold">
            <Target className="h-4 w-4 text-primary" />
            <span>Plan Name</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., October Money Marathon"
            {...register("name")}
            className="h-12 rounded-xl border-2 focus:border-primary transition-all"
          />
          {errors.name && (
            <div className="flex items-center space-x-1 text-sm text-destructive">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.name.message}</span>
            </div>
          )}
        </div>

        {/* Start Wager & Odds Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startWager" className="flex items-center space-x-2 text-sm font-semibold">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Start Wager</span>
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                R
              </span>
              <Input
                id="startWager"
                type="number"
                placeholder="100"
                className="h-12 pl-8 rounded-xl border-2 focus:border-primary transition-all font-semibold"
                {...register("startWager", { valueAsNumber: true })}
              />
            </div>
            {errors.startWager && (
              <p className="text-xs text-destructive">{errors.startWager.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="odds" className="flex items-center space-x-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Odds</span>
            </Label>
            <Input
              id="odds"
              type="number"
              step="0.01"
              placeholder="1.50"
              className="h-12 rounded-xl border-2 focus:border-primary transition-all font-semibold"
              {...register("odds", { valueAsNumber: true })}
            />
            {errors.odds && (
              <p className="text-xs text-destructive">{errors.odds.message}</p>
            )}
          </div>
        </div>

        {/* Duration Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Duration</Label>
          <div className="grid grid-cols-2 gap-3">
            {durationOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue("days", option.value)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  watchedValues.days === option.value
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-2xl">{option.icon}</span>
                  <div>
                    <p className="font-bold text-sm text-foreground">{option.label}</p>
                    <p className="text-xs text-muted-foreground">{option.subtitle}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Projection Card */}
        <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-red-500/10 rounded-2xl p-6 border-2 border-purple-500/20">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Projection</h4>
              <p className="text-xs text-muted-foreground">If all bets win</p>
            </div>
          </div>

          {/* Big Numbers */}
          <div className="space-y-3">
            <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Target Winnings</p>
              <p className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                R {estimatedWinnings.toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background/50 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-1">Multiplier</p>
                <p className="text-xl font-bold text-foreground">
                  {multiplierEffect.toFixed(0)}%
                </p>
              </div>
              <div className="bg-background/50 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-1">ROI</p>
                <p className="text-xl font-bold text-green-600">
                  +{((estimatedWinnings / (watchedValues.startWager || 100) - 1) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-2 bg-background/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((multiplierEffect / 1000) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center mt-4 italic">
            * Assumes consecutive wins. Results may vary.
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-14 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white text-lg font-bold shadow-2xl hover:shadow-3xl transition-all rounded-xl"
          disabled={createPlanMutation.isPending}
        >
          {createPlanMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Rocket className="mr-2 h-5 w-5" />
              Start Marathon
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
