import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function UserProfileMenu() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  // We'll use Clerk directly instead of Convex for user data
  // const userData = useQuery(api.users.getCurrentUser);

  const handleSignOut = async () => {
    try {
      // Sign out using Clerk
      await signOut();

      // Navigate to home page
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // If not loaded yet, show loading state
  if (!isLoaded) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }

  // Get user info from Clerk
  const userInfo = {
    id: user?.id,
    name: user?.fullName,
    email: user?.primaryEmailAddress?.emailAddress,
    imageUrl:
      user?.imageUrl ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || "user"}`,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar>
          <AvatarImage src={userInfo.imageUrl} alt={userInfo.name || "User"} />
          <AvatarFallback>{userInfo.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
        <div className="px-2 py-1.5 text-sm">
          <div className="font-medium">{userInfo.name}</div>
          <div className="text-xs text-muted-foreground">{userInfo.email}</div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/dashboard" className="w-full">
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/campaigns" className="w-full">
            Campaigns
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/dashboard-paid" className="w-full">
            Subscription
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/settings" className="w-full">
            Account Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          <span className="w-full text-left text-red-600">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
