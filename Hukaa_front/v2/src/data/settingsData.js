import {
  KeyRound,
  Shield,
  Monitor,
  SlidersHorizontal,
  UserPen,
  Wrench,
  BellRing,
  EyeOff,
  Ban
} from "lucide-react";

export const settingsData = [
  {
    id: "account",
    title: "Account",
    description: "Manage your account, review security settings, and manage connected apps.",
    type: "group",
    items: [
      {
        id: "username-password",
        title: "Username and password",
        description: "Manage your username, email, and password.",
        icon: KeyRound,
      },
      {
        id: "two-factor",
        title: "Two-factor authentication",
        description: "Add an extra layer of security to your account.",
        icon: Shield,
      },
      {
        id: "active-sessions",
        title: "Active sessions",
        description: "Manage your active sessions.",
        icon: Monitor,
      }
    ],
  },
  {
    id: "profile",
    title: "Profile",
    description: "Update your name, bio, profile pictures, and banner.",
    type: "group",
    items: [
      {
        id: "edit-profile",
        title: "Edit profile",
        description: "Your name, bio, website, and images.",
        icon: UserPen,
      },
      {
        id: "tools",
        title: "The tools you use.",
        description: "Show the tools on your profile.",
        icon: Wrench,
      }
    ]
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Customize what you get notified about and when.",
    type: "group",
    items: [
      {
        id: "browser-notifications",
        title: "Browser notifications",
        description: "Receive notifications in your browser even when you're not on the site.",
        icon: BellRing,
      },
      {
        id: "notification-preferences",
        title: "Notification preferences",
        description: "Manage how you get notified about activity on Hukaa.",
        icon: SlidersHorizontal,
      }
    ]
  },
  {
    id: "messages",
    title: "Messages",
    description: "Control who can send you direct messages.",
    type: "direct",
    componentKey: "messages"
  },
  {
    id: "appearance",
    title: "Appearance",
    description: "Customize your theme and accent color.",
    type: "direct",
    componentKey: "appearance"
  },
  {
    id: "privacy",
    title: "Privacy",
    description: "Manage what information you share with others.",
    type: "group",
    items: [
      {
        id: "visibility",
        title: "Visibility",
        description: "Private browsing and account visibility.",
        icon: EyeOff,
      },
      {
        id: "blocked-accounts",
        title: "Blocked accounts",
        description: "Manage your blocked accounts.",
        icon: Ban,
      }
    ]
  },
  {
    id: "deleted",
    title: "Deleted",
    description: "View recently deleted items and restore them.",
    type: "direct",
    componentKey: "deleted"
  }
];
