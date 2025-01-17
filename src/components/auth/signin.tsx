import AuthForm from "./auth-form";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <AuthForm type="sign-in" />
    </div>
  );
}
