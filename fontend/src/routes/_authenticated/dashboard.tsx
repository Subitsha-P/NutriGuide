import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Sparkles,
  CalendarDays,
  UserRound,
  ChefHat,
  Baby,
  Users,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { PageHeader } from "@/components/app-shell";
import { StatCard, Loading } from "@/components/nutri-ui";
import { Button } from "@/components/ui/button";
import {
  calculateAll,
  isCompleteProfile,
  GOAL_LABELS,
  DIET_LABELS,
  type HealthProfile,
} from "@/lib/nutrition";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard – NutriGuide" },
      { name: "description", content: "Your calorie targets and nutrition overview." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data: profile, isLoading } = useProfile();
  const plans = useQuery({
    queryKey: ["plans", "recent", profile?.user_id || (profile as any)?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meal_plans")
        .select("id,created_at,total_calories,target_calories")
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <Loading />;
  const name = profile?.full_name?.split(" ")[0] || "there";

  if (!isCompleteProfile(profile as Partial<HealthProfile>)) {
    return (
      <>
        <PageHeader
          title={`Hello, ${name}`}
          subtitle="Choose or activate your user profile to calculate your nutrition needs."
        />
        <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-soft">
          <UserRound className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 font-display text-2xl font-semibold">User Profile Required</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Select an existing profile (Subi, Testing user, Senior, etc.) or add your own measurements.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild>
              <Link to="/select-user">
                <Users className="mr-2 h-4 w-4" /> Select User Profile
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/account">View Account</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  const p = profile as unknown as HealthProfile & {
    user_id?: string;
    description?: string;
    allergies?: string[];
    health_conditions?: string[];
  };

  const c = calculateAll({
    ...p,
    weight: Number(p.weight),
    height: Number(p.height),
    age: Number(p.age),
  });

  const proteinRatio = p.goal === "gain" ? 0.3 : p.goal === "lose" ? 0.28 : 0.25;
  const fatRatio = 0.25;
  const carbRatio = 1 - proteinRatio - fatRatio;

  const macros = [
    { name: "Protein", g: Math.round((c.target * proteinRatio) / 4), color: "var(--macro-protein)" },
    { name: "Carbs", g: Math.round((c.target * carbRatio) / 4), color: "var(--macro-carbs)" },
    { name: "Fat", g: Math.round((c.target * fatRatio) / 9), color: "var(--macro-fat)" },
  ];

  return (
    <>
      {/* Active User Switcher Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-xs">
            {(p.full_name || "S").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">{p.full_name}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
                <CheckCircle2 className="h-3 w-3" /> Logged In / Active
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Daily Target: <strong className="text-foreground">{c.target} kcal</strong> · {p.age} yrs · {p.height} cm · {p.weight} kg · {DIET_LABELS[p.diet_type] || p.diet_type}
            </p>
          </div>
        </div>
        <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 border-primary/30 text-xs font-medium text-primary hover:bg-primary/10">
          <Link to="/select-user">
            <Users className="h-3.5 w-3.5" /> Switch User
          </Link>
        </Button>
      </div>

      <PageHeader
        title={`Hello, ${name}`}
        subtitle={`${GOAL_LABELS[p.goal]} · ${DIET_LABELS[p.diet_type]}`}
      />

      {/* Health Conditions / Allergy Alerts */}
      {((p.allergies && p.allergies.length > 0) || (p.health_conditions && p.health_conditions.length > 0)) && (
        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-2.5 text-xs text-muted-foreground">
          <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="font-semibold text-foreground">Active Health Filters:</span>
          {p.allergies?.map((al: string) => (
            <span key={al} className="rounded-md bg-destructive/10 px-2 py-0.5 font-medium text-destructive">
              Allergy: {al}
            </span>
          ))}
          {p.health_conditions?.map((hc: string) => (
            <span
              key={hc}
              className="rounded-md bg-amber-500/15 px-2 py-0.5 font-medium text-amber-700 dark:text-amber-400 capitalize"
            >
              {hc}
            </span>
          ))}
        </div>
      )}

      {/* Metabolic Metric Cards for Logged In User */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="BMI" value={c.bmi} hint={c.bmiCategory} />
        <StatCard label="BMR" value={c.bmr.toLocaleString()} unit="kcal" hint="Energy at rest" />
        <StatCard label="TDEE" value={c.tdee.toLocaleString()} unit="kcal" hint="Maintenance calories" />
        <StatCard label="Daily target" value={c.target.toLocaleString()} unit="kcal" hint={GOAL_LABELS[p.goal]} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-semibold">Suggested daily macros for {name}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Targeted for {GOAL_LABELS[p.goal].toLowerCase()} ({c.target} kcal)
          </p>
          <div className="h-44">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={macros} dataKey="g" innerRadius={50} outerRadius={75} paddingAngle={3}>
                  {macros.map((m) => (
                    <Cell key={m.name} fill={m.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 text-center text-sm">
            {macros.map((m) => (
              <div key={m.name}>
                <p className="font-semibold">{m.g}g</p>
                <p className="text-muted-foreground">{m.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:col-span-2 sm:grid-cols-2">
          <Link
            to="/recommendations"
            className="group rounded-2xl bg-primary p-6 text-primary-foreground shadow-soft transition hover:-translate-y-0.5"
          >
            <Sparkles className="h-6 w-6" />
            <h3 className="mt-6 font-display text-2xl font-semibold">Recommendations</h3>
            <p className="mt-1 text-sm opacity-80">
              Picks tailored for {name}&apos;s {DIET_LABELS[p.diet_type].toLowerCase()} diet and {GOAL_LABELS[p.goal].toLowerCase()} goal.
            </p>
          </Link>

          <Link
            to="/meal-plan"
            className="group rounded-2xl bg-accent p-6 text-accent-foreground shadow-soft transition hover:-translate-y-0.5"
          >
            <CalendarDays className="h-6 w-6" />
            <h3 className="mt-6 font-display text-2xl font-semibold">Generate a meal plan</h3>
            <p className="mt-1 text-sm opacity-80">
              A full day built around {c.target} kcal for {name}.
            </p>
          </Link>

          <Link
            to="/recipes"
            className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-0.5"
          >
            <ChefHat className="h-6 w-6 text-primary" />
            <h3 className="mt-6 font-display text-2xl font-semibold">Indian recipes</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {Number(p.age) >= 60 || p.health_conditions?.includes("senior")
                ? "Featuring soft & easily digestible dishes ideal for seniors."
                : "Recipes for diabetes, heart, BP, weight loss and healthy living."}
            </p>
          </Link>

          <Link
            to="/baby"
            className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-0.5"
          >
            <Baby className="h-6 w-6 text-accent" />
            <h3 className="mt-6 font-display text-2xl font-semibold">Baby Corner</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Infant and toddler nutrition tracker for baby Ananya.
            </p>
          </Link>

          <div className="rounded-2xl border border-border bg-card p-6 sm:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Recent saved plans</h3>
              <Link to="/history" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            {plans.data?.length ? (
              <ul className="mt-3 divide-y divide-border">
                {plans.data.map((pl) => (
                  <li key={pl.id} className="flex justify-between py-2 text-sm">
                    <span>
                      {new Date(pl.created_at).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })}
                    </span>
                    <span className="font-medium">
                      {pl.total_calories} / {pl.target_calories} kcal
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No saved plans yet for this profile.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
