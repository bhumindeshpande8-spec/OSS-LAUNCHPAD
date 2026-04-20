import { Link } from "react-router-dom";

export function AuthFormWrapper({ title, subtitle, children, footerText, footerLink, footerLinkText }) {
  return (
    <div className="min-h-screen bg-paper">
      <div className="container-shell flex min-h-screen items-center justify-center py-12">
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <Link to="/" className="text-sm font-bold text-ocean">
            OSS Launchpad
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-ink">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
          <div className="mt-6">{children}</div>
          <p className="mt-6 text-center text-sm text-slate-600">
            {footerText}{" "}
            <Link className="font-semibold text-ocean hover:text-teal-800" to={footerLink}>
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
