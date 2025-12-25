"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { itineraryAPI } from "@/lib/apiClients";
import ProtectedRoute from "@/components/ProtectedRoute";
function ItineraryPageContent() {
  const params = useParams();
  const itineraryId = params.id as string;

  const {
    data: itinerary,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["itinerary", itineraryId],
    queryFn: () => itineraryAPI.getByID(itineraryId),
    enabled: !!itineraryId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading itinerary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">Failed to load itinerary</p>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Itinerary not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-black dark:text-zinc-50">
          Your Itinerary
        </h1>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
            {itinerary.destination}
          </h2>
          <div className="space-y-2 text-zinc-600 dark:text-zinc-400">
            <p>
              <span className="font-medium">Dates:</span> {itinerary.startDate}{" "}
              → {itinerary.endDate}
            </p>
            <p>
              <span className="font-medium">Budget:</span> {itinerary.budget}
            </p>
            <p>
              <span className="font-medium">Pace:</span> {itinerary.pace}
            </p>
            {itinerary.interests && itinerary.interests.length > 0 && (
              <p>
                <span className="font-medium">Interests:</span>{" "}
                {itinerary.interests.join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Days will go here later */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <p className="text-zinc-600 dark:text-zinc-400">
            Itinerary details will be displayed here once we implement the full
            generation logic.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function itineraryPage() {
  return (
    // React components must start with uppercase
    <ProtectedRoute>
      <ItineraryPageContent />
    </ProtectedRoute>
  );
}
