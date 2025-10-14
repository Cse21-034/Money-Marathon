// frontend/src/components/booking/booking-codes-list.tsx
import { BookingCode } from "@/types/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Copy, Clock, TrendingUp, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface BookingCodesListProps {
  bookingCodes: BookingCode[];
}

export function BookingCodesList({ bookingCodes }: BookingCodesListProps) {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast({
      title: "📋 Copied!",
      description: "Booking code copied to clipboard",
      duration: 2000,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePlaceBet = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (!bookingCodes || bookingCodes.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-xl border border-border">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Booking Codes Yet</h3>
        <p className="text-sm text-muted-foreground">
          Check back soon for new betting opportunities!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookingCodes.map((code) => (
        <Card 
          key={code.id} 
          className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-chart-1"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <Badge className="bg-chart-1/20 text-chart-1 border-chart-1/30">
              <TrendingUp className="h-3 w-3 mr-1" />
              Odds: {parseFloat(code.odds).toFixed(2)}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatTimeAgo(code.createdAt)}</span>
            </span>
          </div>

          {/* Booking Code */}
          <div className="bg-muted/50 rounded-lg p-3 mb-3">
            <p className="text-xs text-muted-foreground mb-1">Booking Code</p>
            <div className="flex items-center justify-between">
              <code className="text-sm font-bold text-foreground font-mono">
                {code.bookingCode}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyCode(code.bookingCode, code.id)}
                className="h-7 w-7 p-0"
              >
                {copiedId === code.id ? (
                  <span className="text-green-600">✓</span>
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>

          {/* Description */}
          {code.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {code.description}
            </p>
          )}

          {/* Expiry */}
          {code.expiresAt && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground mb-3">
              <Calendar className="h-3 w-3" />
              <span>
                Expires: {new Date(code.expiresAt).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={() => handlePlaceBet(code.betwayUrl)}
            className="w-full bg-gradient-to-r from-chart-1 to-chart-1/80 hover:from-chart-1/90 hover:to-chart-1/70"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Place Bet on Betway
          </Button>
        </Card>
      ))}
    </div>
  );
}
