import {
  Activity,
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import { supabase } from "../api/supabase.js";

export default function Login({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isLogin = mode === "login";

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      if (!isLogin) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          onAuthenticated?.(data.session);
        }

        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      onAuthenticated?.(data.session);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setErrorMessage("");
  }

  return (
    <main className="login-page">
      <section className="login-showcase">
        <div className="login-showcase-content">
          <div className="login-brand-mark">
            <Activity size={30} strokeWidth={2.4} />
          </div>

          <p className="login-kicker">Hollywood Athletics Club</p>

          <h1>
            Run with
            <span> purpose.</span>
          </h1>

          <p className="login-showcase-copy">
            Your club. Your progress. Your rewards.
          </p>

          <div className="login-benefits">
            <div>
              <span>
                <Activity size={19} />
              </span>

              <div>
                <strong>Track your progress</strong>
              </div>
            </div>

            <div>
              <span>
                <Trophy size={19} />
              </span>

              <div>
                <strong>Earn club rewards</strong>
                <p>Turn your kilometres and participation into reward points.</p>
              </div>
            </div>

            <div>
              <span>
                <ShieldCheck size={19} />
              </span>

              <div>
                <strong>Built for club members</strong>
                <p>Events, performance and rewards under one Hollywood Athletics profile.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="login-showcase-footer">
          <span>Hollywood Athletics</span>
          <span>Running Together</span>
        </div>
      </section>

      <section className="login-form-side">
        <div className="login-card">
          <div className="login-card-header">
            <span className="login-card-label">
              {isLogin ? "Member Access" : "Club Registration"}
            </span>

            <h2>
              {isLogin ? "Welcome back" : "Join the club"}
            </h2>

            <p>
              {isLogin
                ? "Sign in to access your Hollywood Athletics dashboard."
                : "Create your Hollywood Athletics account to get started."}
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-field">
              <span>Email address</span>

              <div className="login-input-wrap">
                <Mail size={18} />

                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="login-field">
              <span>Password</span>

              <div className="login-input-wrap">
                <Lock size={18} />

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  minLength={6}
                  required
                />
              </div>
            </label>

            {errorMessage && (
              <div className="login-error" role="alert">
                {errorMessage}
              </div>
            )}

            <button
              className="login-submit"
              type="submit"
              disabled={loading}
            >
              <span>
                {loading
                  ? "Please wait..."
                  : isLogin
                    ? "Sign In"
                    : "Create Account"}
              </span>

              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="login-switch">
            <span>
              {isLogin
                ? "New to Hollywood Athletics?"
                : "Already have an account?"}
            </span>

            <button
              type="button"
              onClick={() => changeMode(isLogin ? "register" : "login")}
            >
              {isLogin ? "Create account" : "Sign in"}
            </button>
          </div>

          <div className="login-security">
            <ShieldCheck size={15} />
            <span>Secure member authentication</span>
          </div>
        </div>
      </section>
    </main>
  );
}