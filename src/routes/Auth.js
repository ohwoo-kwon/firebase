import AuthForm from "components/AuthForm";
import { authService } from "fbase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Auth = () => {
  const onSocialClick = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;
    try {
      if (name === "google") {
        provider = new GoogleAuthProvider();
      }
      const data = await signInWithPopup(authService, provider);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <AuthForm />
      <div>
        <button name="google" onClick={onSocialClick}>
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Auth;
