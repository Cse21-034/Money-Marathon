// frontend/src/pages/booking-codes.tsx
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { BookingCodesList } from "@/components/booking/booking-codes-list";
import { AddBookingCodeForm } from "@/components/booking/add-booking-code-form";
import { Ticket, TrendingUp, Users, Clock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function BookingCodes() {
  const { user } = useAuth();
  const [showAdminForm, setShowAdminForm] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["/api/booking-codes"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/booking-codes");
      const result = await response.json();
      return result.bookingCodes || [];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Ticket className="h-7 w-7 text-primary" /> Booking Codes
          </h1>

          {user?.role === "admin" && (
            <Button
              variant="outline"
              onClick={() => setShowAdminForm((prev) => !prev)}
            >
              {showAdminForm ? "Hide Form" : "Add Booking Code"}
            </Button>
          )}
        </div>

        {/* Admin Form */}
        {user?.role === "admin" && showAdminForm && (
          <div className="p-6 bg-card rounded-xl shadow-md border">
            <AddBookingCodeForm
              onSuccess={() => {
                refetch();
                setShowAdminForm(false);
              }}
            />
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-4 bg-card rounded-xl border shadow-sm">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Codes</p>
              <p className="text-2xl font-semibold">{data?.length || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-card rounded-xl border shadow-sm">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Users Booked</p>
              <p className="text-2xl font-semibold">
                {data?.filter((b) => b.usedBy)?.length || 0}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-card rounded-xl border shadow-sm">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Active Codes</p>
              <p className="text-2xl font-semibold">
                {data?.filter((b) => !b.expired)?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="mt-8">
          {data && data.length > 0 ? (
            <BookingCodesList bookingCodes={data} />
          ) : (
            <div className="text-center text-muted-foreground py-12">
              No booking codes found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
