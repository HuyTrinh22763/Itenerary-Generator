import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Without staleTime: Data might refetch every time you switch tabs
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes, reducing unnecessary API calls
      // Disable refetch after a tab switch
      refetchOnWindowFocus: false,
    },
  },
});
