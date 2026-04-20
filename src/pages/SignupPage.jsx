import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthFormWrapper } from "../components/auth/AuthFormWrapper";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { validateSignup } from "../lib/validators";
import { useAuth } from "../hooks/useAuth";

export default function SignupPage() {
  const [values, setValues] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateSignup(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    try {
      await signup(values);
      toast.success("Account created. Check email confirmation if Supabase requires it.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthFormWrapper
      title="Create account"
      subtitle="Build a structured workspace for your first open source contributions."
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Log in"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Full name" value={values.fullName} onChange={(event) => update("fullName", event.target.value)} error={errors.fullName} />
        <Input label="Email" type="email" value={values.email} onChange={(event) => update("email", event.target.value)} error={errors.email} />
        <Input label="Password" type="password" value={values.password} onChange={(event) => update("password", event.target.value)} error={errors.password} />
        <Input label="Confirm password" type="password" value={values.confirmPassword} onChange={(event) => update("confirmPassword", event.target.value)} error={errors.confirmPassword} />
        <Button type="submit" className="w-full" loading={submitting}>
          Create account
        </Button>
      </form>
    </AuthFormWrapper>
  );
}
