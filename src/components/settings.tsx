import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/clerk-react";
import { Twitter, Upload, Save, Check } from "lucide-react";
import { TwitterIntegrationInfo } from "@/components/twitter-integration-info";
import { useTwitterIntegration } from "@/hooks/useTwitterIntegration";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Settings() {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Use Twitter integration hook
  const {
    isConnected: isTwitterConnected,
    connectTwitter,
    disconnectTwitter,
  } = useTwitterIntegration();

  // For now, we'll use local state instead of Convex
  // const userSettings = useQuery(api.users.getUserSettings);
  // const updateUserSettingsMutation = useMutation(api.users.updateUserSettings);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    notifyEmails: true,
    notifyPosts: true,
    notifyMentions: true,
  });

  // Load user data
  useEffect(() => {
    if (isLoaded && user) {
      // Set basic profile data from Clerk
      setProfileData((prev) => ({
        ...prev,
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
      }));
    }

    // Use default settings for now
    setProfileData((prev) => ({
      ...prev,
      bio: prev.bio || "",
      notifyEmails: prev.notifyEmails ?? true,
      notifyPosts: prev.notifyPosts ?? true,
      notifyMentions: prev.notifyMentions ?? true,
    }));
  }, [isLoaded, user]); // Removed userSettings dependency

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleConnectTwitter = async () => {
    setIsConnecting(true);
    try {
      // Connect Twitter using the Convex API
      await connectTwitter({
        accessToken: "mock-token",
        accessTokenSecret: "mock-secret",
        username: "mock_user",
        profileImageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || "user"}`,
      });
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectTwitter = async () => {
    setIsConnecting(true);
    try {
      // Disconnect Twitter using the Convex API
      await disconnectTwitter();
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Save locally for now
      // In a real app, this would save to Convex
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Get user info for display
  const userInfo = {
    name: user?.fullName,
    imageUrl:
      user?.imageUrl ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || "user"}`,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Account Settings
          </h1>

          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                Profile Information
              </h2>

              <div className="flex items-center mb-8">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={userInfo.imageUrl}
                    alt={userInfo.name || "User"}
                  />
                  <AvatarFallback className="text-2xl">
                    {userInfo.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-6">
                  <Button variant="outline" size="sm" className="mb-2">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-gray-500">
                    JPG, GIF or PNG. Max size 2MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={true} // Email managed by Clerk
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself"
                  />
                </div>
              </div>

              <Button
                className="mt-6 bg-indigo-600 hover:bg-indigo-700"
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Save className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Integrations Section */}
          <TwitterIntegrationInfo />
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Connected Accounts</h2>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Twitter className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">Twitter</h3>
                    <p className="text-sm text-gray-500">
                      {isTwitterConnected
                        ? "Your Twitter account is connected"
                        : "Connect your Twitter account to share posts"}
                    </p>
                  </div>
                </div>

                {isTwitterConnected ? (
                  <Button
                    variant="outline"
                    onClick={handleDisconnectTwitter}
                    disabled={isConnecting}
                  >
                    {isConnecting ? "Disconnecting..." : "Disconnect"}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                    onClick={handleConnectTwitter}
                    disabled={isConnecting}
                  >
                    {isConnecting ? "Connecting..." : "Connect"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                Notification Preferences
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">
                      Receive campaign updates via email
                    </p>
                  </div>
                  <Switch
                    checked={profileData.notifyEmails}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("notifyEmails", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">New Post Notifications</h3>
                    <p className="text-sm text-gray-500">
                      Get notified when new posts are created
                    </p>
                  </div>
                  <Switch
                    checked={profileData.notifyPosts}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("notifyPosts", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Mention Notifications</h3>
                    <p className="text-sm text-gray-500">
                      Get notified when you're mentioned
                    </p>
                  </div>
                  <Switch
                    checked={profileData.notifyMentions}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("notifyMentions", checked)
                    }
                  />
                </div>
              </div>

              <Button
                className="mt-6 bg-indigo-600 hover:bg-indigo-700"
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
