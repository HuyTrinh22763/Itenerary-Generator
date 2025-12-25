interface TripSummaryProps {
  destination: string;
  startDate: string;
  endDate: string;
}

function TripSummary({ destination, startDate, endDate }: TripSummaryProps) {
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDay;
  };

  const days = calculateDays();

  const formatDate = (dateString: string) => {
    if (!dateString) return " ";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-black dark:text-zinc-50">
        Trip Summary
      </h2>

      <div className="space-y-3">
        <div>
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Destination:
          </span>
          <p className="text-lg font-semibold text-black dark:text-zinc-50">
            {destination || "Not specified"}
          </p>
        </div>
        <div>
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Dates:
          </span>
          <p className="text-black dark:text-zinc-50">
            {formatDate(startDate)} → {formatDate(endDate)}
          </p>
        </div>

        {days > 0 && (
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Duration:
            </span>
            <p className="text-black dark:text-zinc-50">
              {days} {days === 1 ? "day" : "days"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TripSummary;
