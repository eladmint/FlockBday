import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

export function useCreateDemoUser() {
  const createDemoUserMutation = useMutation(api.createDemoUser.createDemoUser);

  useEffect(() => {
    // Create demo user on component mount
    createDemoUserMutation()
      .then(() => console.log("Demo user created or verified"))
      .catch(console.error);
  }, [createDemoUserMutation]);
}
