import React, { useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/AuthProvider";
import { PencilIcon, MailIcon, PhoneIcon, GraduationCap, UserIcon, IdCardIcon, BookOpenIcon, CheckIcon, XIcon } from "lucide-react";
import { extractNameFromEmail, getInitials } from "@/lib/nameUtils";

export default function Profile() {
  const { user } = useAuth();
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [loading, setLoading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user?.name || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract name from email if name is generic or empty
  const displayName = user?.name && user.name !== "User" && user.name !== "Guest User" 
    ? user.name 
    : user?.email ? extractNameFromEmail(user.email) : "User";

  const userInitials = user?.initials || getInitials(displayName, user?.email);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatar(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleNameSave = async () => {
    try {
      // In a real app, you'd call updateUser API here
      console.log("Saving name:", tempName);
      setIsEditingName(false);
      // You could also update the user context here
    } catch (error) {
      console.error("Failed to update name:", error);
    }
  };

  const handleNameCancel = () => {
    setTempName(displayName);
    setIsEditingName(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background">
      <Card className="max-w-md w-full shadow-xl rounded-2xl border border-border">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold tracking-wide">Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="relative group flex flex-col items-center">
            <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-xl">
              <AvatarImage src={avatar} />
              <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary to-primary/80 text-white">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <button
              className="absolute bottom-0 right-0 bg-primary border-2 border-background rounded-full p-2 shadow-lg hover:bg-primary/90 transition group-hover:scale-110"
              onClick={() => fileInputRef.current?.click()}
              type="button"
              aria-label="Edit profile picture"
            >
              <PencilIcon size={16} className="text-white" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleAvatarChange}
            />
            <button
              className="mt-3 px-4 py-2 text-sm rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition border border-primary/20"
              onClick={() => fileInputRef.current?.click()}
            >
              Change Photo
            </button>
          </div>
          <div className="w-full grid grid-cols-1 gap-3">
            <div className="rounded-lg bg-muted p-4 flex items-center gap-3 shadow-sm border border-border/50">
              <UserIcon size={18} className="text-primary flex-shrink-0" />
              <div className="flex-1">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="flex-1 h-8 text-sm"
                      placeholder="Enter your name"
                    />
                    <Button
                      size="sm"
                      onClick={handleNameSave}
                      className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                    >
                      <CheckIcon size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleNameCancel}
                      className="h-8 w-8 p-0"
                    >
                      <XIcon size={14} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-base">{displayName}</div>
                      <div className="text-xs text-muted-foreground">
                        {user?.email && displayName === extractNameFromEmail(user.email) 
                          ? "Extracted from email" 
                          : "Full Name"
                        }
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingName(true)}
                      className="h-8 w-8 p-0 hover:bg-primary/10"
                    >
                      <PencilIcon size={14} className="text-primary" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-lg bg-muted p-3 flex items-center gap-2 shadow">
              <IdCardIcon size={16} className="text-primary" />
              <div>
                <div className="font-semibold text-base">{user?.roll || "N/A"}</div>
                <div className="text-xs text-muted-foreground">Roll Number</div>
              </div>
            </div>
            <div className="rounded-lg bg-muted p-3 flex items-center gap-2 shadow">
              <BookOpenIcon size={16} className="text-primary" />
              <div>
                <div className="font-semibold text-base">{user?.course || "N/A"}</div>
                <div className="text-xs text-muted-foreground">Course/Branch</div>
              </div>
            </div>
            <div className="rounded-lg bg-muted p-3 flex items-center gap-2 shadow">
              <GraduationCap size={16} className="text-primary" />
              <div>
                <div className="font-semibold text-base">Year: {user?.year || "N/A"} &nbsp; Section: {user?.section || "N/A"}</div>
                <div className="text-xs text-muted-foreground">Year & Section</div>
              </div>
            </div>
            <div className="rounded-lg bg-muted p-4 flex items-center gap-3 shadow-sm border border-border/50">
              <MailIcon size={18} className="text-primary flex-shrink-0" />
              <div>
                <div className="font-semibold text-base break-all">{user?.email || "No email"}</div>
                <div className="text-xs text-muted-foreground">
                  {user?.authProvider === "google" ? "Google Account" : 
                   user?.authProvider === "school" ? "School Account" : "Email Address"}
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-muted p-3 flex items-center gap-2 shadow">
              <PhoneIcon size={16} className="text-primary" />
              <div>
                <div className="font-semibold text-base">{user?.phone || "N/A"}</div>
                <div className="text-xs text-muted-foreground">Phone</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
