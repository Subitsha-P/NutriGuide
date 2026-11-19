import type { Session, User } from "@supabase/supabase-js";

export const TEST_EMAIL = "subi@gmail.com";
export const ALT_TEST_EMAIL = "testing@gmail.com";
export const TEST_PASSWORD = "subi_in_245";
export const TEST_USER_ID = "65f1a2b3c4d5e6f7a8b9c0d1";

// 3-part JWT format: header.payload.signature
export const TEST_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWYxYTJiM2M0ZDVlNmY3YThiOWMwZDEiLCJlbWFpbCI6InN1YmlAZ21haWwuY29tIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJleHAiOjI1MzQwMjMwMDc5OX0.nutriguide_signature";

export const TEST_USER: User = {
  id: TEST_USER_ID,
  email: TEST_EMAIL,
  app_metadata: { provider: "email", providers: ["email"] },
  user_metadata: { full_name: "Subitsha P", username: "subi" },
  aud: "authenticated",
  created_at: "2026-01-10T08:30:00.000Z",
  role: "authenticated",
  updated_at: "2026-11-19T10:00:00.000Z",
};

export const TEST_SESSION: Session = {
  access_token: TEST_TOKEN,
  token_type: "bearer",
  expires_in: 3600000,
  refresh_token: "test-refresh-token",
  user: TEST_USER,
};

export interface UserProfileItem {
  id: string;
  user_id: string;
  username: string;
  full_name: string;
  email: string;
  age: number;
  gender: "female" | "male";
  height: number;
  weight: number;
  activity_level: "sedentary" | "light" | "moderate" | "very" | "extreme";
  goal: "lose" | "maintain" | "gain";
  diet_type: "vegetarian" | "non_vegetarian" | "vegan" | "eggetarian";
  allergies: string[];
  health_conditions: ("obesity" | "diabetes" | "heart" | "hypertension" | "senior")[];
  liked_recipe_ids: string[];
  description: string;
  target_calories?: number;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

export const PRESET_USERS: UserProfileItem[] = [
  {
    id: "65f1a2b3c4d5e6f7a8b9c0d1",
    user_id: "65f1a2b3c4d5e6f7a8b9c0d1",
    username: "subi",
    full_name: "Subitsha P",
    email: "subi@gmail.com",
    age: 23,
    gender: "female",
    height: 162,
    weight: 54,
    activity_level: "moderate",
    goal: "maintain",
    diet_type: "vegetarian",
    allergies: ["peanuts"],
    health_conditions: [],
    liked_recipe_ids: [
      "palak-paneer",
      "moong-dal-khichdi",
      "idli-sambar",
      "vegetable-kurma",
      "ragi-mudde",
    ],
    description: "Primary Account · Maintaining weight with traditional South Indian vegetarian diet",
    target_calories: 2050,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=subi",
    created_at: "2026-01-10T08:35:00.000Z",
    updated_at: "2026-11-19T10:15:00.000Z",
  },
  {
    id: "65f1a2b3c4d5e6f7a8b9c0d9",
    user_id: "65f1a2b3c4d5e6f7a8b9c0d9",
    username: "testing",
    full_name: "Testing User",
    email: "testing@gmail.com",
    age: 28,
    gender: "male",
    height: 178,
    weight: 74,
    activity_level: "very",
    goal: "gain",
    diet_type: "non_vegetarian",
    allergies: [],
    health_conditions: [],
    liked_recipe_ids: ["chicken-curry", "egg-bhurji", "palak-paneer"],
    description: "Fitness & Strength · Muscle gain with high-protein non-veg meal targets",
    target_calories: 2650,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=testing",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-11-19T10:00:00.000Z",
  },
  {
    id: "65f1a2b3c4d5e6f7a8b9c0d5",
    user_id: "65f1a2b3c4d5e6f7a8b9c0d5",
    username: "ramanathan",
    full_name: "Ramanathan P (Grandparent)",
    email: "ramanathan@gmail.com",
    age: 68,
    gender: "male",
    height: 168,
    weight: 66,
    activity_level: "light",
    goal: "maintain",
    diet_type: "vegetarian",
    allergies: [],
    health_conditions: ["senior", "hypertension", "diabetes"],
    liked_recipe_ids: ["moong-dal-khichdi", "idli-sambar", "ragi-mudde"],
    description: "Senior Care · Soft digestible dishes, low sodium & blood sugar management",
    target_calories: 1750,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ramanathan",
    created_at: "2026-01-12T09:00:00.000Z",
    updated_at: "2026-11-19T10:00:00.000Z",
  },
  {
    id: "65f1a2b3c4d5e6f7a8b9c0d6",
    user_id: "65f1a2b3c4d5e6f7a8b9c0d6",
    username: "kavitha",
    full_name: "Kavitha M",
    email: "kavitha@gmail.com",
    age: 32,
    gender: "female",
    height: 158,
    weight: 68,
    activity_level: "light",
    goal: "lose",
    diet_type: "vegetarian",
    allergies: ["dairy"],
    health_conditions: ["obesity"],
    liked_recipe_ids: ["moong-dal-khichdi", "vegetable-kurma"],
    description: "Weight Loss Journey · Calorie deficit, dairy-free balanced vegetarian meals",
    target_calories: 1550,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kavitha",
    created_at: "2026-01-14T09:00:00.000Z",
    updated_at: "2026-11-19T10:00:00.000Z",
  },
];

export const DEFAULT_TEST_PROFILE = PRESET_USERS[0];

export const DEFAULT_TEST_CHILDREN = [
  {
    id: "65f1a2b3c4d5e6f7a8b9c0d4",
    user_id: TEST_USER_ID,
    name: "Ananya",
    birth_date: "2024-08-10",
    diet_type: "vegetarian",
    allergies: [] as string[],
    likes: [
      "Mashed Sweet Potato",
      "Moong Dal Khichdi with Ghee",
      "Steamed Carrot Sticks",
      "Idli Dipped in Curd",
      "Apple Puree",
    ],
    dislikes: ["Bitter Gourd", "Raw Capsicum"],
    created_at: "2026-01-15T09:00:00.000Z",
  },
];

const STORAGE_SESSION_KEY = "nutriguide_test_session";
const STORAGE_PROFILE_KEY = "nutriguide_test_profile";
const STORAGE_SELECTED_USER_KEY = "nutriguide_selected_user_id";
const STORAGE_USERS_LIST_KEY = "nutriguide_users_list";
const STORAGE_MEAL_PLANS_KEY = "nutriguide_test_meal_plans";
const STORAGE_CHILDREN_KEY = "nutriguide_test_children";

export function getAllUsers(): UserProfileItem[] {
  if (typeof window === "undefined") return PRESET_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_USERS_LIST_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_LIST_KEY, JSON.stringify(PRESET_USERS));
      return PRESET_USERS;
    }
    const list = JSON.parse(raw);
    return Array.isArray(list) && list.length > 0 ? list : PRESET_USERS;
  } catch {
    return PRESET_USERS;
  }
}

export function getActiveUserId(): string {
  if (typeof window === "undefined") return PRESET_USERS[0].id;
  try {
    const stored = localStorage.getItem(STORAGE_SELECTED_USER_KEY);
    if (stored) return stored;
    localStorage.setItem(STORAGE_SELECTED_USER_KEY, PRESET_USERS[0].id);
    return PRESET_USERS[0].id;
  } catch {
    return PRESET_USERS[0].id;
  }
}

export function getActiveUser(): UserProfileItem {
  const users = getAllUsers();
  const activeId = getActiveUserId();
  const found = users.find((u) => u.id === activeId || u.user_id === activeId || u.username === activeId);
  return found || users[0] || PRESET_USERS[0];
}

export function switchUser(userIdOrUsername: string): UserProfileItem {
  const users = getAllUsers();
  const target =
    users.find(
      (u) => u.id === userIdOrUsername || u.user_id === userIdOrUsername || u.username === userIdOrUsername
    ) ||
    users[0] ||
    PRESET_USERS[0];

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_SELECTED_USER_KEY, target.id);
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(target));
      localStorage.setItem(STORAGE_SESSION_KEY, "true");
    } catch (e) {
      console.error("[TestAuth] error switching user in localStorage:", e);
    }
  }

  const updatedUser: User = {
    id: target.user_id || target.id,
    email: target.email,
    app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: { full_name: target.full_name, username: target.username },
    aud: "authenticated",
    created_at: target.created_at || "2026-01-10T08:30:00.000Z",
    role: "authenticated",
    updated_at: new Date().toISOString(),
  };

  const updatedSession: Session = {
    access_token: TEST_TOKEN,
    token_type: "bearer",
    expires_in: 3600000,
    refresh_token: "test-refresh-token",
    user: updatedUser,
  };

  notifyTestAuth("USER_UPDATED", updatedSession);
  return target;
}

export function addNewUser(newUser: Partial<UserProfileItem>): UserProfileItem {
  const users = getAllUsers();
  const id = "custom-user-" + Date.now();
  const username = (newUser.username || newUser.full_name || "user")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  const fullItem: UserProfileItem = {
    id,
    user_id: id,
    username: username || "user_" + Date.now().toString().slice(-4),
    full_name: newUser.full_name || "New Family Member",
    email: newUser.email || `${username || "user"}@gmail.com`,
    age: Number(newUser.age) || 25,
    gender: (newUser.gender as "female" | "male") || "female",
    height: Number(newUser.height) || 165,
    weight: Number(newUser.weight) || 60,
    activity_level: newUser.activity_level || "moderate",
    goal: newUser.goal || "maintain",
    diet_type: newUser.diet_type || "vegetarian",
    allergies: newUser.allergies || [],
    health_conditions: newUser.health_conditions || [],
    liked_recipe_ids: newUser.liked_recipe_ids || [],
    description: newUser.description || "Custom family profile",
    target_calories: newUser.target_calories || 2000,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || "user"}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const updatedList = [...users, fullItem];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_USERS_LIST_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error("[TestAuth] error saving new user:", e);
    }
  }

  switchUser(fullItem.id);
  return fullItem;
}

export function isTestEmail(email?: string | null): boolean {
  if (typeof email !== "string") return false;
  const normalized = email.trim().toLowerCase();
  const users = getAllUsers();
  return (
    normalized === TEST_EMAIL.toLowerCase() ||
    normalized === ALT_TEST_EMAIL.toLowerCase() ||
    normalized === "subi" ||
    normalized === "testing" ||
    users.some(
      (u) =>
        u.email.toLowerCase() === normalized ||
        u.username.toLowerCase() === normalized
    )
  );
}

export function isValidTestPassword(email?: string | null, password?: string | null): boolean {
  if (typeof password !== "string" || !password) return false;
  const normEmail = (email || "").trim().toLowerCase();
  if (normEmail === TEST_EMAIL.toLowerCase() || normEmail === "subi") {
    return password === "subi_in_245";
  }
  if (normEmail === ALT_TEST_EMAIL.toLowerCase() || normEmail === "testing") {
    return password === "12345678" || password === "subi_in_245";
  }
  return password === "subi_in_245" || password === "12345678";
}

export function isTestToken(token?: string | null): boolean {
  return (
    token === TEST_TOKEN ||
    (typeof token === "string" &&
      (token.includes("subi") ||
        token.includes("testing@gmail.com") ||
        token.includes("65f1a2b3c4d5e6f7a8b9c0d1")))
  );
}

export function isTestSessionActive(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

const authListeners = new Set<(event: string, session: Session | null) => void>();

export function subscribeTestAuth(callback: (event: string, session: Session | null) => void) {
  authListeners.add(callback);
  return () => {
    authListeners.delete(callback);
  };
}

export function notifyTestAuth(event: string, session: Session | null) {
  authListeners.forEach((cb) => {
    try {
      cb(event, session);
    } catch (e) {
      console.error("[TestAuth] listener error:", e);
    }
  });
}

export function getActiveTestUser(): User {
  const active = getActiveUser();
  return {
    id: active.user_id || active.id,
    email: active.email,
    app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: { full_name: active.full_name, username: active.username },
    aud: "authenticated",
    created_at: active.created_at || "2026-01-10T08:30:00.000Z",
    role: "authenticated",
    updated_at: new Date().toISOString(),
  };
}

export function getActiveTestSession(): Session {
  return {
    access_token: TEST_TOKEN,
    token_type: "bearer",
    expires_in: 3600000,
    refresh_token: "test-refresh-token",
    user: getActiveTestUser(),
  };
}

export function activateTestSession(userEmail?: string): Session {
  let targetUser = PRESET_USERS[0]; // Subi default

  if (userEmail) {
    const norm = userEmail.trim().toLowerCase();
    const users = getAllUsers();
    const matched = users.find(
      (u) =>
        u.email.toLowerCase() === norm ||
        u.username.toLowerCase() === norm ||
        (norm.includes("testing") && u.username === "testing")
    );
    if (matched) {
      targetUser = matched;
    }
  }

  // Switch to the target user so their profile is active everywhere
  switchUser(targetUser.id);

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, "true");
      if (!localStorage.getItem(STORAGE_CHILDREN_KEY)) {
        localStorage.setItem(STORAGE_CHILDREN_KEY, JSON.stringify(DEFAULT_TEST_CHILDREN));
      }
      if (!localStorage.getItem(STORAGE_MEAL_PLANS_KEY)) {
        localStorage.setItem(STORAGE_MEAL_PLANS_KEY, JSON.stringify([]));
      }
    } catch (e) {
      console.error("[TestAuth] localStorage error:", e);
    }
  }

  const session = getActiveTestSession();
  notifyTestAuth("SIGNED_IN", session);
  return session;
}

export function clearTestSession(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch (e) {
      console.error("[TestAuth] localStorage error:", e);
    }
  }
  notifyTestAuth("SIGNED_OUT", null);
}

export function getTestProfile() {
  if (typeof window === "undefined") return DEFAULT_TEST_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_PROFILE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    const active = getActiveUser();
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(active));
    return active;
  } catch {
    return DEFAULT_TEST_PROFILE;
  }
}

export function saveTestProfile(updates: Record<string, unknown>) {
  const current = getTestProfile();
  const next = { ...current, ...updates, updated_at: new Date().toISOString() };
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(next));

      // Also persist to users list
      const users = getAllUsers();
      const idx = users.findIndex(
        (u) => u.id === (next.id || next.user_id) || u.user_id === (next.user_id || next.id)
      );
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...next } as UserProfileItem;
        localStorage.setItem(STORAGE_USERS_LIST_KEY, JSON.stringify(users));
      }
    } catch (e) {
      console.error("[TestAuth] localStorage error:", e);
    }
  }
  return next;
}

export function getTestMealPlans(): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_MEAL_PLANS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTestMealPlan(plan: any) {
  const plans = getTestMealPlans();
  const active = getActiveUser();
  const newPlan = {
    id: plan.id || "test-plan-" + Date.now(),
    user_id: active.user_id || active.id || TEST_USER_ID,
    plan_date: plan.plan_date || new Date().toISOString().slice(0, 10),
    created_at: new Date().toISOString(),
    ...plan,
  };
  const next = [newPlan, ...plans];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_MEAL_PLANS_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("[TestAuth] localStorage error:", e);
    }
  }
  return newPlan;
}

export function deleteTestMealPlan(id: string) {
  const plans = getTestMealPlans().filter((p) => p.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_MEAL_PLANS_KEY, JSON.stringify(plans));
    } catch (e) {
      console.error("[TestAuth] localStorage error:", e);
    }
  }
}

export function getTestChildren(): any[] {
  if (typeof window === "undefined") return DEFAULT_TEST_CHILDREN;
  try {
    const raw = localStorage.getItem(STORAGE_CHILDREN_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_CHILDREN_KEY, JSON.stringify(DEFAULT_TEST_CHILDREN));
      return DEFAULT_TEST_CHILDREN;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_TEST_CHILDREN;
  }
}

export function saveTestChild(payload: any) {
  const children = getTestChildren();
  let updatedChild: any;
  let next: any[];

  if (payload.id) {
    next = children.map((c) => {
      if (c.id === payload.id) {
        updatedChild = { ...c, ...payload };
        return updatedChild;
      }
      return c;
    });
    if (!updatedChild) {
      updatedChild = { ...payload, id: payload.id || "child-test-" + Date.now(), user_id: TEST_USER_ID, created_at: new Date().toISOString() };
      next.push(updatedChild);
    }
  } else {
    updatedChild = { ...payload, id: "child-test-" + Date.now(), user_id: TEST_USER_ID, created_at: new Date().toISOString() };
    next = [...children, updatedChild];
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_CHILDREN_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("[TestAuth] localStorage error:", e);
    }
  }
  return updatedChild;
}

export function deleteTestChild(id: string) {
  const next = getTestChildren().filter((c) => c.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_CHILDREN_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("[TestAuth] localStorage error:", e);
    }
  }
}
