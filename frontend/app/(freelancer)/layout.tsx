import Shell, { type NavItem } from "@/components/freelancer/Shell";
import { freelancerUser } from "@/lib/mock/freelancer";

const nav: NavItem[] = [
  { label: "Home", href: "/freelancer" },
  { label: "Job board", href: "/freelancer/jobs" },
  { label: "Invitations", href: "/freelancer/invitations" },
  { label: "My assignments", href: "/freelancer/assignments" },
  { label: "Portfolio", href: "/freelancer/portfolio" },
  { label: "Availability", href: "/freelancer/availability" },
  { label: "Invoices", href: "/freelancer/invoices" },
];

export default function FreelancerLayout({ children }: { children: React.ReactNode }) {
  return (
    <Shell nav={nav} roleLabel={freelancerUser.role} userName={freelancerUser.name}>
      {children}
    </Shell>
  );
}
