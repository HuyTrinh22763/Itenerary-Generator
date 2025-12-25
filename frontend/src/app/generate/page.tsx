"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { itineraryAPI } from "@/lib/apiClients";
import TripSummary from "@/components/generate/TripSummary";
import BudgetSelector from "@/components/generate/BudgetSelector";
import PaceSelector from "@/components/generate/PaceSelector";
import InterestsSelector from "@/components/generate/InterestsSelector";
import GenerateButton from "@/components/generate/GenerateButton";

function GeneratePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get data from URL
  const destination = searchParams.get("destination") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  // Form state
  const [budget, setBudget] = useState("medium");
  const [pace, setPace] = useState("moderate");
  const [interests, setInterests] = useState<string[]>([]);

  // API Mutation
  const mutation = useMutation({
    mutationFn: (data: {
      destination: string;
      startDate: string;
      endDate: string;
      budget?: string;
      interests?: string[];
      pace?: string;
    }) => itineraryAPI.generate(data),
    onSuccess: (data) => {
      // Redirect to itinerary page when successful
      router.push(`/itinerary/${data.id}`);
    },
    onError: (error) => {
      // Handle error (show alert)
      alert("Failed to generate itinerary. Please try again.");
      console.error(error);
    },
  });

  const handleSubmit = () => {
    // Validate
    if (!destination || !startDate || !endDate) {
      alert("Please fill all required fields");
      return;
    }

    // Call API
    mutation.mutate({
      destination,
      startDate,
      endDate,
      budget,
      interests,
      pace,
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-black dark:text-zinc-50">
          Customize Your Itinerary
        </h1>

        {/* Trip Summary */}
        <TripSummary
          destination={destination}
          startDate={startDate}
          endDate={endDate}
        />

        {/* Form */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <BudgetSelector value={budget} onChange={setBudget} />

          <PaceSelector value={pace} onChange={setPace} />

          <InterestsSelector selected={interests} onChange={setInterests} />

          <GenerateButton loading={mutation.isPending} onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div>Loading....</div>}>
      <GeneratePageContent />
    </Suspense>
  );
}
