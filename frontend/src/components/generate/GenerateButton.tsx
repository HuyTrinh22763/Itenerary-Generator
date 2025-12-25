import { SyncLoader } from "react-spinners";
interface GenerateButtonProps {
  loading: boolean;
  onClick: () => void;
}

function GenerateButton({ loading, onClick }: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <SyncLoader color="#ffffff" size={8} />
          <span>Generating....</span>
        </>
      ) : (
        "Generating Itinerary"
      )}
    </button>
  );
}

export default GenerateButton;
