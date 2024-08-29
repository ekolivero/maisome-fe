import { Icons } from "@/app/blog/components/icons";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItemWithChildren {}

export interface DocsConfig {
  mainNav: MainNavItem[];
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Vendere",
      href: "/blog/vendere",
    },
    {
      title: "Comprare",
      href: "/blog/comprare",
    },
    {
      title: "Affitto",
      href: "/blog/affitto",
    },
    {
      title: "Investire",
      href: "/blog/investire",
    },
    {
      title: "Ristrutturare",
      href: "/blog/ristrutturare",
    },
    {
      title: "Mutuo",
      href: "/blog/mutuo",
    },
    {
      title: "Design",
      href: "/blog/design",
    },
  ]
};
