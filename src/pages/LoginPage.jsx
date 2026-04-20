import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthFormWrapper } from "../components/auth/AuthFormWrapper";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { validateLogin } from "../lib/validators";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateLogin(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    try {
      await login(values);
      toast.success("Welcome back.");
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthFormWrapper
      title="Log in"
      subtitle="Continue tracking your contribution journey."
      footerText="New here?"
      footerLink="/signup"
      footerLinkText="Create an account"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Email" type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} error={errors.email} />
        <Input label="Password" type="password" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} error={errors.password} />
        <Button type="submit" className="w-full" loading={submitting}>
          Log in
        </Button>
      </form>
    </AuthFormWrapper>
  );
}
