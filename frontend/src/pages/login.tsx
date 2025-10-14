// frontend/src/pages/login.tsx - REDESIGNED
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { Sparkles, TrendingUp, Zap, Shield } from "lucide-react";

export default function Login() {
  const [activeTab, setActiveTab] = useState("login");

  const features = [
    { icon: TrendingUp, text: "Track compound growth", color: "text-green-500" },
    { icon: Zap, text: "Real-time updates", color: "text-yellow-500" },
    { icon: Shield, text: "Secure & private", color: "text-blue-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-20 -left-20 animate-float" />
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -bottom-20 -right-20 animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute w-64 h-64 bg-white/5 rounded-full blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6 animate-scale-in">
        {/* Logo & Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl" />
              <div className="relative w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
                <img
                  src="https://iili.io/KFIFETg.png"
                  alt="Money Marathon"
                  className="w-16 h-16 object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">
              Money Marathon
            </h1>
            <p className="text-white/90 text-sm font-medium">
              Your compound betting journey starts here
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 flex items-center space-x-2"
              >
                <feature.icon className={`h-4 w-4 ${feature.color}`} />
                <span className="text-xs text-white font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Card */}
        <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl overflow-hidden">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-xl mb-6">
                <TabsTrigger
                  value="login"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
                >
                  <span className="font-semibold">Login</span>
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
                >
                  <span className="font-semibold">Register</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-0">
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-foreground mb-1">
                      Welcome Back! 👋
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Continue your betting marathon
                    </p>
                  </div>
                  <LoginForm />
                </div>
              </TabsContent>

              <TabsContent value="register" className="mt-0">
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-foreground mb-1">
                      Join the Marathon 🚀
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Create your account to get started
                    </p>
                  </div>
                  <RegisterForm />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
          <div className="flex items-center justify-center space-x-6 text-white">
            <div className="text-center">
              <p className="text-2xl font-bold">1000+</p>
              <p className="text-xs opacity-80">Active Users</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold">500K+</p>
              <p className="text-xs opacity-80">Bets Tracked</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-xs opacity-80">Support</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/70 text-xs">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
