// Sample data for the freelancer dashboard.
// Types mirror the planned Django models. Client names are intentionally
// absent from open roles and invitations (hidden until a job is confirmed).

export type FreelancerTier = "bronze" | "silver" | "gold";

export interface SkillBadge {
  name: string;
  verified: boolean;
}

export interface FreelancerProfile {
  id: number;
  name: string;
  tier: FreelancerTier;
  rating: number; // 0-5
  rating_count: number;
  skills: SkillBadge[];
}

export interface Invitation {
  id: number;
  role_title: string;
  project_type: string;
  shoot_date: string; // ISO date
  location: string;
  rate: number; // LKR per day
  expires_at: string; // ISO datetime
}

export interface OpenRole {
  id: number;
  role_title: string;
  project_type: string;
  shoot_date: string;
  location: string;
  rate: number;
}

export type AssignmentStatus = "confirmed" | "awaiting_call_sheet" | "completed";

export interface Assignment {
  id: number;
  project_title: string;
  role_title: string;
  shoot_date: string;
  location: string;
  status: AssignmentStatus;
  rate: number;
}

export interface MonthlyEarning {
  month: string;
  amount: number;
}

export interface RatingBreakdown {
  label: string;
  score: number; // 0-5
}

export interface AvailabilityDay {
  date: string; // ISO date
  label: string; // e.g. "Mon 16"
  available: boolean;
}

export const freelancerUser = { name: "Ruwan", role: "Freelancer" };

export const profile: FreelancerProfile = {
  id: 4,
  name: "Ruwan",
  tier: "silver",
  rating: 4.7,
  rating_count: 23,
  skills: [
    { name: "Cinematography", verified: true },
    { name: "Drone operation", verified: true },
    { name: "Colour grading", verified: false },
  ],
};

export const invitation: Invitation = {
  id: 1,
  role_title: "Second camera operator",
  project_type: "Wedding",
  shoot_date: "2026-11-21",
  location: "Colombo",
  rate: 32000,
  expires_at: "2026-11-17T18:00:00+05:30",
};

export const openRoles: OpenRole[] = [
  { id: 1, role_title: "Drone pilot", project_type: "Hotel brand film", shoot_date: "2026-11-28", location: "Bentota", rate: 45000 },
  { id: 2, role_title: "Camera operator", project_type: "Corporate event", shoot_date: "2026-11-24", location: "Colombo 03", rate: 30000 },
  { id: 3, role_title: "Gimbal operator", project_type: "Music video", shoot_date: "2026-12-02", location: "Kandy", rate: 28000 },
];

export const assignments: Assignment[] = [
  { id: 1, project_title: "Ceylon Tea Campaign", role_title: "Lead cinematographer", shoot_date: "2026-11-18", location: "Nuwara Eliya", status: "confirmed", rate: 48000 },
  { id: 2, project_title: "Perera Wedding", role_title: "Camera operator", shoot_date: "2026-11-19", location: "Galle", status: "awaiting_call_sheet", rate: 32000 },
  { id: 3, project_title: "Corporate AGM Coverage", role_title: "Camera operator", shoot_date: "2026-11-05", location: "Colombo", status: "completed", rate: 30000 },
];

export const earningsSummary = {
  this_month: 142000,
  pending_payout: 78000,
  paid_this_year: 1264000,
};

export const monthlyEarnings: MonthlyEarning[] = [
  { month: "Jun", amount: 98000 },
  { month: "Jul", amount: 124000 },
  { month: "Aug", amount: 87000 },
  { month: "Sep", amount: 156000 },
  { month: "Oct", amount: 131000 },
  { month: "Nov", amount: 142000 },
];

export const ratingBreakdown: RatingBreakdown[] = [
  { label: "Quality of work", score: 4.9 },
  { label: "Punctuality", score: 4.6 },
  { label: "Teamwork", score: 4.7 },
];

export const availability: AvailabilityDay[] = [
  { date: "2026-11-16", label: "Mon 16", available: true },
  { date: "2026-11-17", label: "Tue 17", available: true },
  { date: "2026-11-18", label: "Wed 18", available: false },
  { date: "2026-11-19", label: "Thu 19", available: false },
  { date: "2026-11-20", label: "Fri 20", available: true },
  { date: "2026-11-21", label: "Sat 21", available: true },
  { date: "2026-11-22", label: "Sun 22", available: false },
];
