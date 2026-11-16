// Sample data for the owner dashboard.
// Types mirror the planned Django models so we can swap in API calls later.

export type ProjectStage =
  | "enquiry"
  | "quotation"
  | "confirmed"
  | "in_production"
  | "post_production"
  | "delivered";

export interface Project {
  id: number;
  name: string;
  client_name: string;
  stage: ProjectStage;
  revenue: number; // LKR, quoted price
  cost: number; // LKR, crew + equipment + studio
}

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export interface Invoice {
  id: number;
  project_id: number;
  number: string;
  amount: number;
  status: InvoiceStatus;
  due_date: string; // ISO date
}

export type ApprovalKind = "discount" | "high_cost_role" | "payout";

export interface ApprovalRequest {
  id: number;
  kind: ApprovalKind;
  title: string;
  detail: string;
  amount: number;
  requested_by: string;
}

export interface ScheduleItem {
  id: number;
  start_time: string; // "HH:mm"
  title: string;
  location: string;
  crew_count: number;
}

export type AlertSeverity = "high" | "medium";

export interface OwnerAlert {
  id: number;
  severity: AlertSeverity;
  message: string;
}

export const STAGE_LABELS: Record<ProjectStage, string> = {
  enquiry: "Enquiry",
  quotation: "Quotation sent",
  confirmed: "Confirmed",
  in_production: "In production",
  post_production: "Post-production",
  delivered: "Delivered",
};

export const STAGE_ORDER: ProjectStage[] = [
  "enquiry",
  "quotation",
  "confirmed",
  "in_production",
  "post_production",
  "delivered",
];

export const ownerUser = { name: "Nimal", role: "Owner" };

export const revenueThisMonth = 4850000;

export const projects: Project[] = [
  { id: 1, name: "Perera Wedding", client_name: "Perera family", stage: "in_production", revenue: 950000, cost: 610000 },
  { id: 2, name: "Ceylon Tea Campaign", client_name: "Ceylon Leaf Co.", stage: "post_production", revenue: 1800000, cost: 1020000 },
  { id: 3, name: "Hotel Brand Film", client_name: "Blue Lagoon Resort", stage: "confirmed", revenue: 2400000, cost: 1650000 },
  { id: 4, name: "Product Shoot – Batik", client_name: "Batik Lanka", stage: "quotation", revenue: 380000, cost: 210000 },
  { id: 5, name: "Music Video – Sayuri", client_name: "Sayuri Music", stage: "enquiry", revenue: 700000, cost: 0 },
  { id: 6, name: "Corporate AGM Coverage", client_name: "Lanka Finance PLC", stage: "delivered", revenue: 520000, cost: 330000 },
  { id: 7, name: "Fashion Lookbook", client_name: "Kandy Threads", stage: "quotation", revenue: 450000, cost: 260000 },
  { id: 8, name: "Documentary Teaser", client_name: "Heritage Trust", stage: "enquiry", revenue: 600000, cost: 0 },
];

export const invoices: Invoice[] = [
  { id: 1, project_id: 2, number: "INV-0231", amount: 900000, status: "overdue", due_date: "2026-11-02" },
  { id: 2, project_id: 3, number: "INV-0238", amount: 1200000, status: "sent", due_date: "2026-11-25" },
  { id: 3, project_id: 1, number: "INV-0240", amount: 475000, status: "sent", due_date: "2026-11-30" },
  { id: 4, project_id: 6, number: "INV-0225", amount: 520000, status: "paid", due_date: "2026-10-20" },
];

export const approvals: ApprovalRequest[] = [
  { id: 1, kind: "discount", title: "12% discount – Batik Lanka", detail: "Requested by Dilani on quotation Q-0412", amount: 45600, requested_by: "dilani" },
  { id: 2, kind: "high_cost_role", title: "Drone pilot above rate cap", detail: "Hotel Brand Film, 3 days", amount: 180000, requested_by: "dilani" },
  { id: 3, kind: "payout", title: "Freelancer payout – Ruwan", detail: "Ceylon Tea Campaign, 4 shoot days", amount: 96000, requested_by: "system" },
];

export const todaysSchedule: ScheduleItem[] = [
  { id: 1, start_time: "07:30", title: "Perera Wedding – getting ready", location: "Galle Face Hotel", crew_count: 4 },
  { id: 2, start_time: "11:00", title: "Colour grading review", location: "Edit suite, Maharagama", crew_count: 2 },
  { id: 3, start_time: "15:00", title: "Hotel Brand Film – recce", location: "Blue Lagoon Resort", crew_count: 3 },
];

export const alerts: OwnerAlert[] = [
  { id: 1, severity: "high", message: "INV-0231 (Ceylon Leaf Co.) is 14 days overdue." },
  { id: 2, severity: "medium", message: "Crew score for camera assistant Tharindu dropped below 3.0." },
  { id: 3, severity: "medium", message: "Studio B fire-safety licence expires in 9 days." },
];
