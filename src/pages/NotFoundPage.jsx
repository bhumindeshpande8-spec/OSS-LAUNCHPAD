import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-bold text-ocean">404</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Page not found</h1>
        <p className="mt-3 text-slate-600">That route is not part of this contribution workspace.</p>
        <Link to="/dashboard">
          <Button className="mt-6">Go to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
