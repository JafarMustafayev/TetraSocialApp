import {
  KeyRound,
  Shield,
  Monitor,
  Link2,
  TriangleAlert,
  UserPen,
  Wrench,
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
        icon: KeyRound,
      },
      {
        id: "two-factor",
        title: "Two-factor authentication",
        icon: Shield,
      },
      {
        id: "active-sessions",
        title: "Active sessions",
        icon: Monitor,
      },
      {
        id: "connected-accounts",
        title: "Connected accounts",
        icon: Link2,
      },
      {
        id: "delete-account",
        title: "Delete account",
        icon: TriangleAlert,
      },
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
    type: "direct",
    componentKey: "notifications"
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
    type: "direct",
    componentKey: "privacy"
  },
  {
    id: "username",
    title: "Username",
    description: "Change your unique username handle.",
    type: "direct",
    componentKey: "username"
  },
  {
    id: "feed",
    title: "Feed",
    description: "Adjust how your feed is generated and displayed.",
    type: "direct",
    componentKey: "feed"
  },
  {
    id: "developer",
    title: "Developer",
    description: "Manage API keys and developer applications.",
    type: "direct",
    componentKey: "developer"
  },
  {
    id: "deleted",
    title: "Deleted",
    description: "View recently deleted items and restore them.",
    type: "direct",
    componentKey: "deleted"
  }
];
