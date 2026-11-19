import { describe, expect, it, beforeEach } from "vitest";
import {
  TEST_EMAIL,
  TEST_PASSWORD,
  TEST_USER_ID,
  isTestEmail,
  isValidTestPassword,
  isTestToken,
  activateTestSession,
  clearTestSession,
  isTestSessionActive,
  getTestProfile,
  getTestMealPlans,
  saveTestMealPlan,
  getAllUsers,
  getActiveUser,
  switchUser,
} from "@/lib/test-auth";
import { supabase } from "@/integrations/supabase/client";

describe("Testing Credentials and Authentication", () => {
  beforeEach(() => {
    clearTestSession();
  });

  it("has exact testing email and new password configured for Subi", () => {
    expect(TEST_EMAIL).toBe("subi@gmail.com");
    expect(TEST_PASSWORD).toBe("subi_in_245");
    expect(isTestEmail("subi@gmail.com")).toBe(true);
    expect(isTestEmail("testing@gmail.com")).toBe(true);
    expect(isTestEmail("  SUBI@GMAIL.COM ")).toBe(true);
    expect(isTestEmail("other@gmail.com")).toBe(false);

    // Password validation tests
    expect(isValidTestPassword("subi@gmail.com", "subi_in_245")).toBe(true);
    expect(isValidTestPassword("subi@gmail.com", "12345678")).toBe(false);
    expect(isValidTestPassword("testing@gmail.com", "12345678")).toBe(true);
  });

  it("validates test tokens correctly", () => {
    expect(isTestToken("custom.subi@gmail.com.token")).toBe(true);
    expect(isTestToken("custom.testing@gmail.com.token")).toBe(true);
    expect(isTestToken("invalid-token")).toBe(false);
  });

  it("signs in successfully with Subi credentials using new password subi_in_245", async () => {
    const res = await supabase.auth.signInWithPassword({
      email: "subi@gmail.com",
      password: "subi_in_245",
    });

    expect(res.error).toBeNull();
    expect(res.data.user).toBeDefined();
    expect(res.data.user?.email).toBe("subi@gmail.com");
    expect(res.data.user?.id).toBe(TEST_USER_ID);
    expect(res.data.session).toBeDefined();
    expect(isTestSessionActive()).toBe(true);

    const userRes = await supabase.auth.getUser();
    expect(userRes.data.user?.email).toBe("subi@gmail.com");

    const sessionRes = await supabase.auth.getSession();
    expect(sessionRes.data.session?.user.email).toBe("subi@gmail.com");

    // Profile details match Subi
    const profile = getTestProfile();
    expect(profile.full_name).toBe("Subitsha P");
    expect(profile.diet_type).toBe("vegetarian");
    expect(profile.age).toBe(23);
  });

  it("rejects Subi account when using old password", async () => {
    const res = await supabase.auth.signInWithPassword({
      email: "subi@gmail.com",
      password: "12345678",
    });

    expect(res.error).toBeDefined();
    expect(res.data.user).toBeNull();
  });

  it("signs in as testing@gmail.com and loads Testing User details", async () => {
    const res = await supabase.auth.signInWithPassword({
      email: "testing@gmail.com",
      password: "12345678",
    });

    expect(res.error).toBeNull();
    expect(res.data.user).toBeDefined();
    expect(res.data.user?.email).toBe("testing@gmail.com");

    // Details match Testing User
    const profile = getTestProfile();
    expect(profile.username).toBe("testing");
    expect(profile.diet_type).toBe("non_vegetarian");
    expect(profile.goal).toBe("gain");
  });

  it("rejects testing email with wrong password", async () => {
    const res = await supabase.auth.signInWithPassword({
      email: "testing@gmail.com",
      password: "wrongpassword",
    });

    expect(res.error).toBeDefined();
    expect(res.data.user).toBeNull();
  });

  it("signs out correctly and clears test session", async () => {
    activateTestSession();
    expect(isTestSessionActive()).toBe(true);

    const outRes = await supabase.auth.signOut();
    expect(outRes.error).toBeNull();
    expect(isTestSessionActive()).toBe(false);
  });

  it("provides and updates test profile through mock builder", async () => {
    activateTestSession();
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", TEST_USER_ID)
      .maybeSingle();
    expect(profile).toBeDefined();
    expect(profile.user_id).toBe(TEST_USER_ID);
    expect(profile.diet_type).toBe("vegetarian");

    await supabase.from("profiles").update({ full_name: "Updated Subi" }).eq("user_id", TEST_USER_ID);
    const updated = getTestProfile();
    expect(updated.full_name).toBe("Updated Subi");
  });

  it("switches active user profile and updates data accordingly", () => {
    const users = getAllUsers();
    expect(users.length).toBeGreaterThanOrEqual(2);

    // Switch to Testing User
    const testing = users.find((u) => u.username === "testing")!;
    switchUser(testing.id);
    expect(getActiveUser().username).toBe("testing");
    expect(getTestProfile().diet_type).toBe("non_vegetarian");

    // Switch to Subi
    const subi = users.find((u) => u.username === "subi")!;
    switchUser(subi.id);
    expect(getActiveUser().username).toBe("subi");
    expect(getTestProfile().diet_type).toBe("vegetarian");
  });
});
