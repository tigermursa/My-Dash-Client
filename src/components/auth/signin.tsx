import AuthForm from "./auth-form";
import "./auth.css";
export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 container-ani-bg z-10">
      <div className="z-20">
        <AuthForm type="sign-in" />
      </div>
    </div>
  );
}
