// Auth helpers. Member 3 owns this file once the Django auth endpoints exist.

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

// While the Django backend is not built, set NEXT_PUBLIC_MOCK_AUTH=true in .env.local.
// Any demo user below can sign in with the password Lova@1234.
export const MOCK_AUTH = process.env.NEXT_PUBLIC_MOCK_AUTH === "true";
export const MOCK_PASSWORD = "Lova@1234";
const MOCK_USERS: Record<string, { role: Role; name: string }> = {
  nimal: { role: "owner", name: "Nimal Perera" },
  dilani: { role: "manager", name: "Dilani Fernando" },
  kasun: { role: "employee", name: "Kasun Silva" },
  ruwan: { role: "freelancer", name: "Ruwan Bandara" },
  hasini: { role: "client", name: "Hasini Abeysekara" },
};

export async function login(username: string, password: string): Promise<Session> {
  if (MOCK_AUTH) {
    await new Promise((r) => setTimeout(r, 600));
    const user = MOCK_USERS[username.trim().toLowerCase()];
    if (!user || password !== MOCK_PASSWORD) throw new Error("Incorrect username or password.");
    return { access: "mock", refresh: "mock", ...user };
  }

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

  // The backend's GET /api/auth/me/ returns the user's role and name.
  const meRes = await fetch(`${API_URL}/auth/me/`, { headers: { Authorization: `Bearer ${tokens.access}` } });
  if (!meRes.ok) throw new Error("Signed in, but could not load your profile.");
  const me: { role: Role; first_name: string; last_name: string } = await meRes.json();
  return { ...tokens, role: me.role, name: `${me.first_name} ${me.last_name}`.trim() };
}

// ---- Client registration ----------------------------------------------------

export type RegisterInput = {
  first_name: string;
  last_name: string;
  company_name: string;
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

// Backend contract for Member 3:
//   POST /api/auth/register/  with the fields above
//   creates a User (role "client"), a Client (company_name) and a ClientContact
//   201 on success. On 400 return { "<field>": ["message", ...] } for each bad field.
export async function registerClient(input: RegisterInput): Promise<void> {
  if (MOCK_AUTH) {
    await new Promise((r) => setTimeout(r, 700));
    if (MOCK_USERS[input.username.trim().toLowerCase()])
      throw new RegisterError("Please fix the highlighted field.", { username: "That username is already taken." });
    return;
  }

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

// Temporary storage. Member 3 can replace this with httpOnly cookies.
export function saveSession(session: Session, remember: boolean) {
  const store = remember ? window.localStorage : window.sessionStorage;
  store.setItem("lova_session", JSON.stringify(session));
}
