// Auth helpers: sign in, client registration and the saved session.

export type Role = "owner" | "manager" | "employee" | "freelancer" | "client";

export type Session = { access: string; refresh: string; role: Role; name: string };

// Where each role lands after signing in (these pages are built by each member).
export const ROLE_HOME: Record<Role, string> = {
  owner: "/owner",
  manager: "/manager",
  employee: "/employee",
  freelancer: "/freelancer",
  client: "/client",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export async function login(username: string, password: string): Promise<Session> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim(), password }),
    });
  } catch {
    throw new Error("Cannot reach the server. Please try again later.");
  }
  if (res.status === 400 || res.status === 401) throw new Error("Incorrect username or password.");
  if (!res.ok) throw new Error("Something went wrong. Please try again.");
  const tokens: { access: string; refresh: string } = await res.json();

  // GET /api/auth/me/ returns the user's role and name.
  const meRes = await fetch(`${API_URL}/auth/me/`, { headers: { Authorization: `Bearer ${tokens.access}` } });
  if (!meRes.ok) throw new Error("Signed in, but could not load your profile.");
  const me: { role: Role; first_name: string; last_name: string } = await meRes.json();
  return { ...tokens, role: me.role, name: `${me.first_name} ${me.last_name}`.trim() };
}

// ---- Client registration ----------------------------------------------------

export type RegisterInput = {
  client_type: "individual" | "company";
  first_name: string;
  last_name: string;
  company_name: string; // required for companies, empty for individuals
  email: string;
  phone: string;
  username: string;
  password: string;
};

/** Thrown when the server rejects a field, e.g. { username: "That username is already taken." } */
export class RegisterError extends Error {
  fields: Record<string, string>;
  constructor(message: string, fields: Record<string, string> = {}) {
    super(message);
    this.fields = fields;
  }
}

// POST /api/auth/register/ creates a User (role "client"), a Client and a ClientContact.
// It returns 201 on success, or 400 with { "<field>": ["message", ...] } for each bad field.
export async function registerClient(input: RegisterInput): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    throw new Error("Cannot reach the server. Please try again later.");
  }
  if (res.status === 400) {
    const body: Record<string, string[] | string> = await res.json().catch(() => ({}));
    const fields: Record<string, string> = {};
    for (const [k, val] of Object.entries(body)) fields[k] = Array.isArray(val) ? val[0] : String(val);
    throw new RegisterError("Please fix the highlighted fields.", fields);
  }
  if (!res.ok) throw new Error("Something went wrong. Please try again.");
}

// Temporary storage. Can be replaced with httpOnly cookies later.
export function saveSession(session: Session, remember: boolean) {
  const store = remember ? window.localStorage : window.sessionStorage;
  store.setItem("lova_session", JSON.stringify(session));
}