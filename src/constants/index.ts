// General
export const WebName = "MaiaLabs";
export const Description = "Authentication App Template for Next.js";
export const Creator = "Milan";
export const Keywords = [
  "Template",
  "Next.js",
  "Authentication",
  "Supabase",
  "MaiaLabs",
];
export const CopyRight = `@${new Date().getFullYear()} ${WebName}. All Rights Reserved`;
export const LogoSVG = "/logo.svg";
export const Supportmail = "support@maialabs.net";

// Referal - Social Media Links
const YoutubeLink = "https://github.com/MilanKiele/next-supabase-template";
const GithubLink = "https://github.com/MilanKiele/next-supabase-template";
const CompanyLink = "https://github.com/MilanKiele/next-supabase-template";
export { YoutubeLink, GithubLink, CompanyLink };

// Navbar
export const NavbarConfig = [
  {
    name: "Home",
    id: "/",
  },
  {
    name: "Posts",
    id: "/posts",
  },
];

// Footer
export const FooterContent = {
  sections: [
    {
      title: "General",
      links: [
        { label: "Home", href: "/" },
        { label: "Posts", href: "/posts" },
        { label: "Legal", href: "/legal" },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "Profile", href: "/settings" },
        { label: "Login", href: "/login" },
        { label: "Support", href: "/legal" },
      ],
    },
  ],
};

export const BottomLinks = [{ label: "Legal Information", href: "/legal" }];
