"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh

    // Basic validation
    if (!destination.trim()) {
      alert("Please enter a destination");
      return;
    }

    if (!startDate || !endDate) {
      alert("Please enter both dates");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      alert("End date must be after start date");
      return;
    }

    // Navigate to generate page (we'll pass data later)
    router.push(
      `/generate?destination=${encodeURIComponent(
        destination
      )}&startDate=${startDate}&endDate=${endDate}`
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {/* Form will start here */}
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-2 text-black dark:text-zinc-50">
            Plan Your Trip
          </h1>
          <p className="text-center mb-8 text-zinc-600 dark:text-zinc-400">
            Enter your destination and dates to generate a personalized
            itinerary
          </p>

          {/* Form fields will start here */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input fields will go here */}
            <div>
              <label
                htmlFor="destination"
                className="block text-sm font-medium mb-2 text-black dark:text-zinc-50"
              >
                Destination
              </label>
              <input
                type="text"
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Paris, Tokyo, New York"
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium mb-2 text-black dark:text-zinc-50"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium mb-2 text-black dark:text-zinc-50"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Generate Itinerary
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
