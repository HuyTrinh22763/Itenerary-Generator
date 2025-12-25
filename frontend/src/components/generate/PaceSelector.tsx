interface PaceSelectorProps {
  value: string;
  onChange(value: string): void;
}

function PaceSelector({ value, onChange }: PaceSelectorProps) {
  const PaceOptions = [
    {
      value: "relaxed",
      label: "Relaxed",
      description: "Take it easy, enjoy at your own pace",
    },
    {
      value: "moderate",
      label: "Moderate",
      description: "Balanced mix of activities",
    },
    {
      value: "packed",
      label: "Packed",
      description: "See everything, maximize your time",
    },
  ];
  return (
    <div className="mb-6">
      <label className="">Trip Pace</label>
      <div className="space-y-2">
        {PaceOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-center p-4 border border-zinc-300 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <input
              type="radio"
              name="pace"
              value={option.value}
              checked={option.value === value}
              onChange={(e) => onChange(option.value)}
              className="mr-3"
            />

            <div>
              <div className="font-medium text-black dark:text-zinc-50">
                {option.label}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {option.description}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

export default PaceSelector;
