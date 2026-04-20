import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, BookOpen, CheckCircle2, Compass, Github, ListTodo, Rocket } from "lucide-react";
import { Button } from "../components/ui/Button";

const features = [
  { icon: Compass, title: "Discover beginner-ready repos", text: "Filter by stack, category, setup complexity, and issue availability." },
  { icon: ListTodo, title: "Track contribution work", text: "Move each saved project through a clear open source contribution journey." },
  { icon: BookOpen, title: "Keep learning notes", text: "Store setup steps, commands, blockers, PR notes, and lessons per project." },
  { icon: BarChart3, title: "Measure consistency", text: "See saved repos, completed tasks, merged PR stages, and category patterns." }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-shell flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-ink">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-ocean text-white">
              <Rocket className="h-5 w-5" />
            </span>
            OSS Launchpad
          </Link>
          <nav className="flex items-center gap-3">
            <Link className="text-sm font-semibold text-slate-600 hover:text-ink" to="/login">
              Log in
            </Link>
            <Link to="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="container-shell grid min-h-[calc(100vh-4rem)] items-center gap-10 py-14 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-teal-200 bg-mint px-3 py-1 text-sm font-semibold text-ocean">
              <Github className="h-4 w-4" />
              Beginner open source, organized
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-ink sm:text-5xl lg:text-6xl">
              Turn open source confusion into a clear contribution workflow.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              OSS Launchpad gives students one workspace to discover approachable repositories, save projects,
              manage issues, write learning notes, and track progress from interest to merged PR.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/signup">
                <Button size="lg">
                  Start your workspace <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary">
                  I already have an account
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <div className="rounded-md bg-ink p-4 text-white">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Contribution board</span>
                <span className="rounded-md bg-white/10 px-2 py-1 text-xs">Live workspace</span>
              </div>
              <div className="mt-5 space-y-3">
                {["Interested", "Setup Done", "Issue Selected", "PR Opened"].map((stage, index) => (
                  <div key={stage} className="rounded-md bg-white p-3 text-ink">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{stage}</span>
                      <span className="text-xs text-slate-500">{index + 2} tasks</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-coral" style={{ width: `${30 + index * 16}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-16">
          <div className="container-shell">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold text-ink">Built around the beginner problem</h2>
              <p className="mt-4 text-slate-600">
                Discovery, task tracking, notes, and consistency usually live in separate places. OSS Launchpad
                brings them together so new contributors can follow a repeatable path instead of guessing.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {features.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-lg border border-slate-200 bg-paper p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-mint text-ocean">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-bold text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container-shell py-16">
          <div className="grid gap-8 lg:grid-cols-3">
            {["Find a good first fit", "Save and plan", "Ship with reflection"].map((step, index) => (
              <div key={step} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ocean font-bold text-white">{index + 1}</span>
                <div>
                  <h3 className="font-bold text-ink">{step}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {index === 0
                      ? "Use filters and metadata to find projects that match your current skills."
                      : index === 1
                        ? "Bookmark repos, choose a stage, and break contribution work into tasks."
                        : "Capture notes, unblock yourself faster, and monitor your contribution growth."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-ink py-16 text-white">
          <div className="container-shell flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-bold">Make your first PR less mysterious.</h2>
              <p className="mt-3 max-w-2xl text-slate-300">Build a habit, not a scattered pile of browser tabs.</p>
            </div>
            <Link to="/signup">
              <Button size="lg" className="bg-white text-ink hover:bg-slate-100">
                Create account <CheckCircle2 className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="container-shell text-sm text-slate-500">OSS Launchpad · Open Source Starter Platform</div>
      </footer>
    </div>
  );
}
