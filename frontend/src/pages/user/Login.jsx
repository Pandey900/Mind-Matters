import React, { useState } from "react";
import { MdAlternateEmail, MdOutlineRemoveRedEye } from "react-icons/md";
import { Link, useNavigate, useLocation } from "react-router-dom";
import GoogleLogin from "../../components/headers/Social/GoogleLogin";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const location = useLocation();
  const { login, error, setError, loader, setLoader } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoader(true);

    const form = e.target;
    const email = form.email.value;
    const password = passwordInput;
    console.log(password);

    // CAUTION: This is a security risk and should not be used in production
    // console.log("Login attempt - Email:", email, "Password:", password);

    try {
      await login(email, password);
      alert("Login Successful");
      const from = location.state?.from?.pathname || "/dashboard";
      // const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err) {
      if (err.code === "auth/invalid-login-credentials") {
        setError("Invalid email or password. Please try again.");
        setPasswordInput(""); // Clear password field
      } else {
        setError(err.message);
      }
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="max-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-secondary sm:text-3xl text-center">
        Get Started Today
      </h1>
      <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
        Explore our comprehensive library of courses, meticulously crafted to
        cater to all levels of expertise.
      </p>

      <div className="mx-auto max-w-lg mb-0 mt-6 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-center text-red-400 text-lg font-medium">
            Sign in to your account
          </p>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                className="w-full border outline-none rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                required
              />
              <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <MdAlternateEmail className="h-4 w-4 text-gray-400" />
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                className="w-full border outline-none rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 end-0 grid place-content-center px-4 cursor-pointer"
              >
                <MdOutlineRemoveRedEye className="h-4 w-4 text-gray-400" />
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="block w-full rounded-lg bg-secondary px-5 py-3 text-sm font-medium text-white"
              disabled={loader}
            >
              {loader ? "Signing in..." : "Sign in"}
            </button>
            <Link to="/forgot-password" className="text-sm text-secondary">
              Forgot Password?
            </Link>
          </div>
          <p className="text-center text-sm text-gray-500">
            No account?{" "}
            <Link className="underline text-secondary ml-2" to="/register">
              Sign up
            </Link>
          </p>
        </form>
        <GoogleLogin />
      </div>
    </div>
  );
};

export default Login;
