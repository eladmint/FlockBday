import { useUser } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function useStoreUserEffect() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  // When this state is set we know the server
  // has stored the user.
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  // Use the actual store mutation instead of mock
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    // If the user is not logged in don't do anything
    if (!isAuthenticated) {
      return;
    }

    // Store the user in the database
    let cancelled = false;
    storeUser()
      .then((id) => {
        if (!cancelled) {
          setUserId(id as Id<"users">);
        }
      })
      .catch((error) => {
        console.error("Failed to store user:", error);
      });

    return () => {
      cancelled = true;
      setUserId(null);
    };
  }, [isAuthenticated, user?.id, storeUser]);

  // Combine the local state with the state from context
  return {
    isLoading: isLoading || (isAuthenticated && userId === null),
    isAuthenticated: isAuthenticated && userId !== null,
  };
}
