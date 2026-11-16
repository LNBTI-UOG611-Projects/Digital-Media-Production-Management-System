import Shell, { type NavItem } from "@/components/owner/Shell";
import { ownerUser } from "@/lib/mock/owner";

const nav: NavItem[] = [
  { label: "Dashboard", href: "/owner" },
  { label: "Requests", href: "/owner/requests" },
  { label: "Quotations", href: "/owner/quotations" },
  { label: "Projects", href: "/owner/projects" },
  { label: "Calendar", href: "/owner/calendar" },
  { label: "Crew and freelancers", href: "/owner/crew" },
  { label: "Equipment and studios", href: "/owner/equipment" },
  { label: "Finance", href: "/owner/finance" },
  { label: "Reports", href: "/owner/reports" },
  { label: "Settings", href: "/owner/settings" },
];

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <Shell nav={nav} roleLabel={ownerUser.role} userName={ownerUser.name}>
      {children}
    </Shell>
  );
}
