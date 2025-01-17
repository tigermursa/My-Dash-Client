import AuthForm from "./auth-form";

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <AuthForm type="sign-up" />
    </div>
  );
}
