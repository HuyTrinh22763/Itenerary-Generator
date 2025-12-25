interface BudgetSelectorProps {
  value: string;
  onChange(s: string): void;
}

function BudgetSelector({ value, onChange }: BudgetSelectorProps) {
  const BudgetOptions = [
    {
      value: "low",
      label: "Low Budget",
      description: "Low budget options for customers",
    },
    {
      value: "medium",
      label: "Medium Budget",
      description: "Medium budget options for customers",
    },
    {
      value: "high",
      label: "High Budget",
      description: "High budget options for customers",
    },
  ];
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-3 text-black dark:text-zinc-50">
        Budget Level
      </label>

      <div className="space-y-2">
        {BudgetOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-center p-4 border border-zinc-300 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <input
              type="radio"
              name="budget"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
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

export default BudgetSelector;
