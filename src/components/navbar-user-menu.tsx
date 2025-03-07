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
import { Link } from "react-router-dom";

export function NavbarUserMenu() {
  const [currentUser, setCurrentUser] = useState({
    id: "user123",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  });

  // Set the current user ID in localStorage for other components to access
  useEffect(() => {
    localStorage.setItem("currentUserId", currentUser.id);
  }, [currentUser]);

  const switchUser = () => {
    // Toggle between two mock users for demo purposes
    if (currentUser.id === "user123") {
      setCurrentUser({
        id: "user456",
        name: "Jane Smith",
        email: "jane@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      });
    } else {
      setCurrentUser({
        id: "user123",
        name: "John Doe",
        email: "john@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar>
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback>{currentUser.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
        <div className="px-2 py-1.5 text-sm">
          <div className="font-medium">{currentUser.name}</div>
          <div className="text-xs text-muted-foreground">
            {currentUser.email}
          </div>
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
        <DropdownMenuItem onClick={switchUser}>
          <span className="w-full text-left text-blue-600">
            Switch User (Demo)
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <a
            href="https://clerk.com/account"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            Account Settings
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full text-left text-red-600"
          >
            Sign Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
