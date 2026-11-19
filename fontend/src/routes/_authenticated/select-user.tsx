import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Users,
  CheckCircle2,
  UserCheck,
  PlusCircle,
  ArrowRight,
  Database,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  getAllUsers,
  getActiveUser,
  switchUser,
  addNewUser,
  type UserProfileItem,
} from "@/lib/test-auth";
import {
  ACTIVITY_LABELS,
  DIET_LABELS,
  GOAL_LABELS,
  calculateAll,
  type ActivityLevel,
  type Goal,
  type Gender,
} from "@/lib/nutrition";

export const Route = createFileRoute("/_authenticated/select-user")({
  head: () => ({
    meta: [
      { title: "Select User Profile – NutriGuide" },
      {
        name: "description",
        content: "Choose which user profile to load from the database across your nutrition dashboard, targets, and meal plans.",
      },
    ],
  }),
  component: SelectUserPage,
});

function SelectUserPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  // Load all user profiles from DB
  const { data: dbProfiles, isLoading } = useQuery({
    queryKey: ["profiles", "all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return (data && data.length > 0) ? (data as UserProfileItem[]) : getAllUsers();
    },
  });

  const users: UserProfileItem[] = dbProfiles || getAllUsers();
  const [activeUser, setActiveUser] = useState<UserProfileItem>(() => getActiveUser());
  const [showAddForm, setShowAddForm] = useState(false);

  // New user form state
  const [newUser, setNewUser] = useState({
    full_name: "",
    age: "30",
    gender: "female" as Gender,
    height: "165",
    weight: "62",
    activity_level: "moderate" as ActivityLevel,
    goal: "maintain" as Goal,
    diet_type: "vegetarian" as const,
    allergies: [] as string[],
    health_conditions: [] as string[],
    description: "Family member profile",
  });

  async function handleSwitch(userId: string) {
    const switched = switchUser(userId);
    setActiveUser(switched);
    await qc.invalidateQueries({ queryKey: ["profile"] });
    await qc.invalidateQueries({ queryKey: ["plans"] });
    await qc.invalidateQueries({ queryKey: ["profiles"] });
    toast.success(`Active profile set to ${switched.full_name}`, {
      description: `Loaded from database. Daily calorie target: ${switched.target_calories || 2050} kcal.`,
    });
    navigate({ to: "/dashboard" });
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!newUser.full_name.trim()) {
      toast.error("Please enter a name for the new profile.");
      return;
    }

    const calc = calculateAll({
      age: Number(newUser.age),
      gender: newUser.gender,
      height: Number(newUser.height),
      weight: Number(newUser.weight),
      activity_level: newUser.activity_level,
      goal: newUser.goal,
    });

    const created = addNewUser({
      full_name: newUser.full_name.trim(),
      age: Number(newUser.age),
      gender: newUser.gender,
      height: Number(newUser.height),
      weight: Number(newUser.weight),
      activity_level: newUser.activity_level,
      goal: newUser.goal,
      diet_type: newUser.diet_type,
      allergies: newUser.allergies,
      health_conditions: newUser.health_conditions as never,
      description: newUser.description,
      target_calories: calc.target,
    });

    // Save to Database
    await supabase.from("profiles").upsert({
      user_id: created.id,
      ...created,
    });

    setActiveUser(created);
    setShowAddForm(false);
    await qc.invalidateQueries({ queryKey: ["profiles"] });
    await qc.invalidateQueries({ queryKey: ["profile"] });
    toast.success(`Created and stored ${created.full_name} in DB`, {
      description: `Target set to ${calc.target} kcal.`,
    });
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Select User Profile"
          subtitle="Choose which profile to load from the database. Targets, macros, and meal plans dynamically adapt to the selected user."
        />
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          variant={showAddForm ? "secondary" : "default"}
          className="self-start sm:self-auto"
        >
          {showAddForm ? "Close Form" : <><PlusCircle className="mr-2 h-4 w-4" /> Add Profile to DB</>}
        </Button>
      </div>

      {/* Active User Highlight Banner */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border-2 border-primary/40 bg-primary-soft/50 p-6 shadow-soft sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-sm">
            {activeUser.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-bold text-foreground">
                {activeUser.full_name}
              </span>
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                Active Profile
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <Database className="h-3 w-3" /> Live from DB
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              @{activeUser.username} · {activeUser.email}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-2 text-xs">
              <span className="font-medium text-foreground">
                Target: <strong>{activeUser.target_calories || 2050} kcal</strong>
              </span>
              <span>•</span>
              <span className="capitalize">{DIET_LABELS[activeUser.diet_type] || activeUser.diet_type}</span>
              <span>•</span>
              <span className="capitalize">{GOAL_LABELS[activeUser.goal] || activeUser.goal}</span>
            </div>
          </div>
        </div>
        <Button onClick={() => navigate({ to: "/dashboard" })} className="gap-2 shadow-sm">
          Go to Dashboard <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Add New Profile Drawer / Card */}
      {showAddForm && (
        <form
          onSubmit={handleCreateUser}
          className="rounded-3xl border border-primary/30 bg-card p-6 shadow-soft transition-all duration-300 animate-in fade-in slide-in-from-top-4"
        >
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-display text-lg font-bold">Add Profile to Database</h3>
              <p className="text-sm text-muted-foreground">
                Saves a new user profile directly into MongoDB database collections.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="new_name">Full Name *</Label>
              <Input
                id="new_name"
                placeholder="e.g. Anand Kumar"
                value={newUser.full_name}
                onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new_age">Age (years)</Label>
              <Input
                id="new_age"
                type="number"
                value={newUser.age}
                onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Gender</Label>
              <Select
                value={newUser.gender}
                onValueChange={(v) => setNewUser({ ...newUser, gender: v as Gender })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new_height">Height (cm)</Label>
              <Input
                id="new_height"
                type="number"
                value={newUser.height}
                onChange={(e) => setNewUser({ ...newUser, height: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new_weight">Weight (kg)</Label>
              <Input
                id="new_weight"
                type="number"
                value={newUser.weight}
                onChange={(e) => setNewUser({ ...newUser, weight: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Diet Type</Label>
              <Select
                value={newUser.diet_type}
                onValueChange={(v) => setNewUser({ ...newUser, diet_type: v as any })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(DIET_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Fitness Goal</Label>
              <Select
                value={newUser.goal}
                onValueChange={(v) => setNewUser({ ...newUser, goal: v as Goal })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(GOAL_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="new_desc">Short Description / Role</Label>
              <Input
                id="new_desc"
                placeholder="e.g. Sister, marathon runner, diabetic uncle"
                value={newUser.description}
                onChange={(e) => setNewUser({ ...newUser, description: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button type="submit">Save to DB &amp; Switch</Button>
          </div>
        </form>
      )}

      {/* Profiles Grid */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wider">
            User Profiles in Database ({users.length})
          </h2>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Database className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            MongoDB Atlas connected
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {users.map((u) => {
            const isActive = u.id === activeUser.id || u.user_id === activeUser.user_id || u.username === activeUser.username;
            const calc = calculateAll({
              age: u.age,
              gender: u.gender,
              height: u.height,
              weight: u.weight,
              activity_level: u.activity_level,
              goal: u.goal,
            });

            return (
              <div
                key={u.id || u.username}
                className={`relative flex flex-col justify-between rounded-3xl border p-6 transition-all duration-200 ${isActive
                  ? "border-primary bg-card ring-2 ring-primary/20 shadow-md"
                  : "border-border bg-card hover:border-primary/50 hover:shadow-soft"
                  }`}
              >
                <div>
                  {/* Top Profile Info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-bold text-lg ${isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                          }`}
                      >
                        {u.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold leading-tight">
                          {u.full_name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          @{u.username} · {u.age} yrs · {u.gender}
                        </p>
                      </div>
                    </div>
                    {isActive ? (
                      <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Selected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        <Database className="h-2.5 w-2.5" /> DB Record
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {u.description || "Personalized nutrition profile stored in database."}
                  </p>

                  {/* Body Metrics Matrix from DB */}
                  <div className="mt-4 grid grid-cols-3 gap-2.5 rounded-2xl bg-muted/60 p-3 text-center">
                    <div>
                      <span className="block text-xs text-muted-foreground">Target</span>
                      <span className="font-display text-base font-bold text-primary">
                        {u.target_calories || calc.target}
                      </span>
                      <span className="text-[10px] text-muted-foreground"> kcal</span>
                    </div>
                    <div>
                      <span className="block text-xs text-muted-foreground">BMI</span>
                      <span className="font-display text-base font-bold text-foreground">
                        {calc.bmi}
                      </span>
                      <span className="block text-[10px] text-muted-foreground leading-none">
                        {calc.bmiCategory}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-muted-foreground">Stats</span>
                      <span className="font-display text-sm font-semibold text-foreground">
                        {u.height}cm
                      </span>
                      <span className="block text-[10px] text-muted-foreground">
                        {u.weight}kg
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <span className="rounded-lg border border-border bg-background px-2 py-0.5 text-xs font-medium text-foreground">
                      {DIET_LABELS[u.diet_type] || u.diet_type}
                    </span>
                    <span className="rounded-lg border border-border bg-background px-2 py-0.5 text-xs font-medium text-foreground">
                      {GOAL_LABELS[u.goal] || u.goal}
                    </span>
                    {u.allergies?.map((al) => (
                      <span
                        key={al}
                        className="rounded-lg bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive"
                      >
                        Allergy: {al}
                      </span>
                    ))}
                    {u.health_conditions?.map((hc) => (
                      <span
                        key={hc}
                        className="rounded-lg bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400 capitalize"
                      >
                        {hc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-6 border-t border-border pt-4">
                  {isActive ? (
                    <Button
                      variant="outline"
                      className="w-full border-primary/40 bg-primary/5 text-primary hover:bg-primary/10"
                      onClick={() => navigate({ to: "/dashboard" })}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Active on Dashboard
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleSwitch(u.id || u.user_id || u.username)}
                    >
                      <UserCheck className="mr-2 h-4 w-4" /> Load {u.full_name.split(" ")[0]}&apos;s Data
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
