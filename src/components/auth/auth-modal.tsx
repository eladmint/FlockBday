import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TwitterAuthButton } from "@/components/auth/twitter-auth-button";
import { useToast } from "@/components/ui/use-toast";
import { Mail } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "signin" | "signup";
  onSuccess?: () => void;
}

export function AuthModal({
  isOpen,
  onClose,
  mode,
  onSuccess,
}: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real implementation, this would call Clerk's API
      // For demo purposes, we'll simulate a successful auth after a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Enable demo mode
      localStorage.setItem("demoMode", "true");
      localStorage.setItem("currentUserId", "user123");

      // Call success callback if provided
      if (onSuccess) onSuccess();

      // Close the modal
      onClose();

      toast({
        title: "Success",
        description:
          mode === "signin"
            ? "Signed in successfully"
            : "Account created successfully",
      });

      // Reload the page to update UI
      window.location.reload();
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "Authentication Failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwitterSuccess = () => {
    // Enable demo mode
    localStorage.setItem("demoMode", "true");
    localStorage.setItem("currentUserId", "user123");

    // Call success callback if provided
    if (onSuccess) onSuccess();

    // Close the modal
    onClose();

    // Reload the page to update UI
    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "signin" ? "Sign In" : "Create an Account"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading}
            >
              <Mail className="h-4 w-4 mr-2" />
              {isLoading
                ? "Processing..."
                : mode === "signin"
                  ? "Sign In with Email"
                  : "Sign Up with Email"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <TwitterAuthButton
            className="w-full"
            onSuccess={handleTwitterSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
