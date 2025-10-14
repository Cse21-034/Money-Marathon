// frontend/src/components/booking/add-booking-code-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertBookingCodeSchema, type InsertBookingCode } from "@/types/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Link2, TrendingUp, FileText } from "lucide-react";
import { useState } from "react";

interface AddBookingCodeFormProps {
  onSuccess?: () => void;
}

export function AddBookingCodeForm({ onSuccess }: AddBookingCodeFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InsertBookingCode>({
    resolver: zodResolver(insertBookingCodeSchema),
  });

  // Function to parse WhatsApp booking URL
  const parseBookingUrl = (text: string) => {
    // Extract booking code from URL or text
    const codeMatch = text.match(/bookingCode=([A-Z0-9]+)|booking code[:\s]+([A-Z0-9]+)/i);
    const bookingCode = codeMatch ? (codeMatch[1] || codeMatch[2]) : "";
    
    // Extract full URL
    const urlMatch = text.match(/(https?:\/\/[^\s]+)/);
    const betwayUrl = urlMatch ? urlMatch[0] : "";
    
    return { bookingCode, betwayUrl };
  };

  const createBookingMutation = useMutation({
    mutationFn: async (data: InsertBookingCode) => {
      const response = await apiRequest("POST", "/api/booking-codes", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/booking-codes"] });
      toast({
        title: "✅ Booking Code Added!",
        description: "Your booking code is now live for users to view.",
        duration: 3000,
      });
      reset();
      setIsExpanded(false);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Failed to add booking code",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBookingCode) => {
    createBookingMutation.mutate(data);
  };

  const handleQuickPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const { bookingCode, betwayUrl } = parseBookingUrl(text);
      
      if (bookingCode && betwayUrl) {
        reset({
          bookingCode,
          betwayUrl,
          odds: 2.0, // Default odds
          description: "",
        });
        setIsExpanded(true);
        toast({
          title: "📋 Auto-filled!",
          description: "Booking code and URL extracted from clipboard",
        });
      } else {
        toast({
          title: "⚠️ Invalid format",
          description: "Couldn't extract booking code from clipboard",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Paste failed",
        description: "Unable to read from clipboard",
        variant: "destructive",
      });
    }
  };

  if (!isExpanded) {
    return (
      <div className="bg-gradient-to-br from-chart-1/10 to-chart-1/5 rounded-xl border border-chart-1/20 p-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-chart-1/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Plus className="h-6 w-6 text-chart-1" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Share a Booking Code</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Paste your Betway booking code URL from WhatsApp
          </p>
          <div className="flex space-x-2 justify-center">
            <Button
              onClick={handleQuickPaste}
              variant="outline"
              className="bg-background"
            >
              📋 Quick Paste from Clipboard
            </Button>
            <Button
              onClick={() => setIsExpanded(true)}
              className="bg-gradient-to-r from-chart-1 to-chart-1/80"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Manually
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Add Booking Code</h3>
          <p className="text-sm text-muted-foreground">Share your betting slip with users</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(false)}
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Booking Code */}
        <div className="space-y-2">
          <Label htmlFor="bookingCode" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Booking Code</span>
          </Label>
          <Input
            id="bookingCode"
            placeholder="e.g., BW13D7FAA1"
            {...register("bookingCode")}
            className="font-mono"
          />
          {errors.bookingCode && (
            <p className="text-sm text-destructive">{errors.bookingCode.message}</p>
          )}
        </div>

        {/* Betway URL */}
        <div className="space-y-2">
          <Label htmlFor="betwayUrl" className="flex items-center space-x-2">
            <Link2 className="h-4 w-4" />
            <span>Betway URL</span>
          </Label>
          <Input
            id="betwayUrl"
            placeholder="https://www.betway.co.bw?bookingCode=..."
            {...register("betwayUrl")}
          />
          {errors.betwayUrl && (
            <p className="text-sm text-destructive">{errors.betwayUrl.message}</p>
          )}
        </div>

        {/* Odds */}
        <div className="space-y-2">
          <Label htmlFor="odds" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Total Odds</span>
          </Label>
          <Input
            id="odds"
            type="number"
            step="0.01"
            placeholder="2.50"
            {...register("odds", { valueAsNumber: true })}
          />
          {errors.odds && (
            <p className="text-sm text-destructive">{errors.odds.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="e.g., Premier League accumulator, 5 matches"
            rows={3}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-chart-1 to-chart-1/80"
          disabled={createBookingMutation.isPending}
        >
          {createBookingMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Share Booking Code
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
