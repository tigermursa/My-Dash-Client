import AuthForm from "./auth-form";
import "./auth.css";
export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 container-ani-bg ">
      <div className="z-20">
        <AuthForm type="sign-up" />
      </div>
    </div>
  );
}
