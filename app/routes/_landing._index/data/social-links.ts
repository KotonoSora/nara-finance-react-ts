interface SocialLink {
  name: string;
  href: string;
  type: "social" | "developer" | "video";
  icon?: string;
}

const socialLinks: SocialLink[] = [
  // Social Networks
  {
    name: "Facebook",
    href: "https://facebook.com/{{APP_NAME}}",
    type: "social",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/{{APP_NAME}}",
    type: "social",
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@{{APP_NAME}}",
    type: "social",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/{{APP_NAME}}",
    type: "social",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@{{APP_NAME}}",
    type: "video",
  },
  {
    name: "X",
    href: "https://x.com/{{APP_NAME}}",
    type: "social",
  },

  // Development
  {
    name: "GitHub",
    href: "https://github.com/{{APP_NAME}}",
    type: "developer",
  },
];

export default socialLinks;
