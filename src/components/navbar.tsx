import { SignInButton, useUser, useClerk } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { Link, useLocation } from "react-router-dom";
import { UserProfileMenu } from "@/components/user-profile-menu";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/auth-modal";
import { useState } from "react";

export function Navbar() {
  const { isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const location = useLocation();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
      />
      <nav className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-indigo-600">Tempo</span>
              </Link>

              <Authenticated>
                <div className="hidden md:flex space-x-6">
                  <NavLink to="/" active={isActive("/")}>
                    Home
                  </NavLink>
                  <NavLink to="/campaigns" active={isActive("/campaigns")}>
                    Campaigns
                  </NavLink>
                  <NavLink to="/dashboard" active={isActive("/dashboard")}>
                    Dashboard
                  </NavLink>
                </div>
              </Authenticated>
            </div>

            {isLoaded ? (
              <div className="flex items-center space-x-4">
                <Authenticated>
                  <div className="flex items-center space-x-4">
                    <UserProfileMenu />
                  </div>
                </Authenticated>
                <Unauthenticated>
                  <SignInButton mode="modal" signUpFallbackRedirectUrl="/">
                    <Button className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-200">
                      Sign In
                    </Button>
                  </SignInButton>
                </Unauthenticated>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

function NavLink({ to, active, children }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        active ? "text-indigo-600" : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {children}
    </Link>
  );
}
