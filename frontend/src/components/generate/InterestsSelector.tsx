interface InterestsSelectorProps {
  selected: string[];
  onChange(interests: string[]): void;
}

function InterestsSelector({ selected, onChange }: InterestsSelectorProps) {
  const InterestsOption = [
    {
      value: "food",
      label: "Interested in Food & Dining",
      description: "Restaurants, cafes, food markets, and culinary experiences",
    },
    {
      value: "culture",
      label: "Interested in Culture & History",
      description:
        "Museums, historical sites, art galleries, and cultural landmarks",
    },
    {
      value: "nature",
      label: "Interested in Nature & Outdoors",
      description:
        "Parks, hiking trails, beaches, gardens, and scenic viewpoints",
    },
    {
      value: "adventure",
      label: "Interested in Adventure & Sports",
      description:
        "Outdoor activities, sports events, extreme sports, and active experiences",
    },
    {
      value: "shopping",
      label: "Interested in Shopping",
      description: "Markets, malls, boutiques, and local shopping districts",
    },
    {
      value: "nightlife",
      label: "Interested in Nightlife",
      description: "Bars, clubs, live music venues, and evening entertainment",
    },
  ];
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-3 text-black dark:text-zinc-50">
        Select your interests
      </label>
      <div className="space-y-2">
        {InterestsOption.map((option) => (
          <label
            key={option.value}
            className="flex items-center p-4 border border-zinc-300 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <input
              type="checkbox"
              name="interests"
              value={option.value}
              checked={selected.includes(option.value)}
              onChange={(e) => {
                if (e.target.checked) {
                  // Checkbox was checked - ADD to current array
                  onChange([...selected, option.value]);
                } else {
                  // Checkbox was unchecked - REMOVE from array
                  onChange(selected.filter((item) => item !== option.value));
                }
              }}
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

export default InterestsSelector;
