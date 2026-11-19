import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CircleUserRound,
  Users,
  Sparkles,
  ShieldAlert,
  Heart,
  CalendarDays,
  Flame,
  Scale,
  Activity,
  ArrowRight,
  CheckCircle2,
  Mail,
  Baby,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { PageHeader } from "@/components/app-shell";
import { Loading, StatCard } from "@/components/nutri-ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  calculateAll,
  GOAL_LABELS,
  DIET_LABELS,
  ACTIVITY_LABELS,
  allergenLabel,
  type HealthProfile,
} from "@/lib/nutrition";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "Account Profile – NutriGuide" },
      {
        name: "description",
        content: "View your personal account details, body metrics, and dietary preferences.",
      },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();

  if (isLoading) return <Loading />;

  const fullName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    (user?.email?.toLowerCase().includes("subi") ? "Subitsha P" : "Testing User");
  const username =
    (profile as any)?.username ||
    user?.user_metadata?.username ||
    (user?.email ? user.email.split("@")[0] : "subi");
  const email = user?.email || (profile as any)?.email || "subi@gmail.com";

  const p: HealthProfile = {
    age: Number(profile?.age ?? 23),
    gender: (profile?.gender as any) ?? "female",
    height: Number(profile?.height ?? 162),
    weight: Number(profile?.weight ?? 54),
    activity_level: (profile?.activity_level as any) ?? "moderate",
    goal: (profile?.goal as any) ?? "maintain",
    diet_type: (profile?.diet_type as any) ?? "vegetarian",
    allergies: profile?.allergies ?? [],
    conditions: ((profile as any)?.health_conditions ?? []) as string[],
  };

  const calc = calculateAll(p);
  const likedDishes = (((profile as any)?.liked_recipe_ids as string[]) || []).filter(Boolean);

  const formatDishName = (slug: string) =>
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Account Profile"
          subtitle="Your personal identity, health measurements, and diet configuration."
        />
        <Button asChild className="shrink-0 gap-2">
          <Link to="/select-user">
            <Users className="h-4 w-4" /> Switch Profile
          </Link>
        </Button>
      </div>

      {/* User Hero Banner */}
      <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/15 font-display text-3xl font-bold text-primary shadow-inner">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {fullName}
              </h2>
              <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
                @{username}
              </Badge>
              <Badge variant="secondary">Verified User</Badge>
            </div>
            <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
              <Mail className="h-3.5 w-3.5" /> {email}
            </p>
            <p className="text-xs text-muted-foreground">
              Logged in account · Targets and meal plans dynamically adapt to this profile.
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/select-user">
                <Users className="mr-1.5 h-3.5 w-3.5" /> Switch User
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Vital Metabolic & Target Stats */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold tracking-tight">Key Metabolic Metrics</h3>
          <span className="text-xs text-muted-foreground">
            Mifflin-St Jeor formula &amp; activity multiplier
          </span>
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="BMI"
            value={calc.bmi}
            hint={`${calc.bmiCategory} (${p.height}cm, ${p.weight}kg)`}
          />
          <StatCard
            label="BMR"
            value={calc.bmr.toLocaleString()}
            unit="kcal"
            hint="Energy at rest"
          />
          <StatCard
            label="TDEE"
            value={calc.tdee.toLocaleString()}
            unit="kcal"
            hint="Maintenance requirement"
          />
          <StatCard
            label="Daily Target"
            value={calc.target.toLocaleString()}
            unit="kcal"
            hint={GOAL_LABELS[p.goal]}
          />
        </div>
      </div>

      {/* Detail Cards Grid */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Physical & Fitness Stats */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2 font-semibold">
              <Scale className="h-5 w-5 text-primary" />
              <span>Body &amp; Activity</span>
            </div>
            <Badge variant="outline" className="text-xs capitalize">
              {p.gender}
            </Badge>
          </div>
          <dl className="mt-4 divide-y divide-border/40 text-sm">
            <div className="flex justify-between py-2.5">
              <dt className="text-muted-foreground">Age</dt>
              <dd className="font-semibold text-foreground">{p.age} years</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-muted-foreground">Gender</dt>
              <dd className="font-semibold capitalize text-foreground">{p.gender}</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-muted-foreground">Height</dt>
              <dd className="font-semibold text-foreground">{p.height} cm</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-muted-foreground">Weight</dt>
              <dd className="font-semibold text-foreground">{p.weight} kg</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-muted-foreground">Activity Level</dt>
              <dd className="font-semibold text-foreground">{ACTIVITY_LABELS[p.activity_level]}</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-muted-foreground">Fitness Goal</dt>
              <dd className="font-semibold text-foreground">{GOAL_LABELS[p.goal]}</dd>
            </div>
          </dl>
        </div>

        {/* Dietary Rules & Allergies */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-5 w-5 text-accent" />
              <span>Diet &amp; Health Rules</span>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              {DIET_LABELS[p.diet_type] || p.diet_type}
            </Badge>
          </div>
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Dietary Type</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {DIET_LABELS[p.diet_type] || p.diet_type}
                </span>
                <span className="text-xs text-muted-foreground">
                  {p.diet_type === "vegetarian"
                    ? "Vegetarian & plant-based foods"
                    : p.diet_type === "vegan"
                    ? "100% plant-based"
                    : "Balanced omnivore diet"}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">Food Allergies</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {p.allergies.length > 0 ? (
                  p.allergies.map((allergy) => (
                    <Badge key={allergy} variant="destructive" className="gap-1">
                      <ShieldAlert className="h-3 w-3" /> {allergenLabel(allergy)}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No declared allergies</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">Health Conditions</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {p.conditions.length > 0 ? (
                  p.conditions.map((cond) => (
                    <Badge key={cond} variant="outline" className="border-accent/40 text-accent capitalize">
                      {cond}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">None specified (General healthy adult)</span>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
              Recipe suggestions and daily meal plans automatically filter dishes according to these rules.
            </div>
          </div>
        </div>
      </div>

      {/* Liked Indian Dishes */}
      {likedDishes.length > 0 && (
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2 font-semibold">
              <Heart className="h-5 w-5 text-rose-500 fill-rose-500/20" />
              <span>Liked Indian Dishes &amp; Preferences</span>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs">
              <Link to="/recipes">Explore Recipes →</Link>
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Custom recommendations prioritize these dishes to hit {calc.target} kcal:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {likedDishes.map((slug) => (
              <Badge key={slug} variant="secondary" className="px-3 py-1 text-xs font-medium">
                ❤️ {formatDishName(slug)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          to="/select-user"
          className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/40"
        >
          <Users className="h-5 w-5 text-primary" />
          <h4 className="mt-3 font-semibold text-foreground">Select User Profile</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            Switch between Subi, testing user, or add family members.
          </p>
        </Link>
        <Link
          to="/meal-plan"
          className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-accent/40"
        >
          <CalendarDays className="h-5 w-5 text-accent" />
          <h4 className="mt-3 font-semibold text-foreground">View Daily Meal Plan</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            Today&apos;s meal schedule built for {calc.target} kcal.
          </p>
        </Link>
        <Link
          to="/recommendations"
          className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/40"
        >
          <Sparkles className="h-5 w-5 text-primary" />
          <h4 className="mt-3 font-semibold text-foreground">Recommendations</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            Personalized food ranking tailored for {fullName.split(" ")[0]}.
          </p>
        </Link>
      </div>
    </>
  );
}
