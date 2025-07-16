import axios from "axios";
import React, { useContext, useState, useTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/url";
import { toast } from "react-toastify";
import { AuthContext } from "../context/userContext";
import Notification from "../components/notification/Notification";
import { useAppConfig } from "../context/AppConfigContext";

const AdminSignIn = () => {
  const [hide, setHide] = useState(true);
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const { login } = useContext(AuthContext) || { login: () => {} };
  const [user, setUser] = useState({
    userId: "",
    email: "",
    name: "",
    role: "",
    isAdmin: false,
    profilePicture: "",
  });

  const { config } = useAppConfig();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await axios.post(`${BASE_URL}/auth/login`, data);
        if (res.data.user.role !== "admin") {
          toast.error("Only admin can login from this page");
          setError("Only admin can login from this page");
          return;
        }

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        const userObj = {
          userId: res.data.user._id,
          email: res.data.user.email,
          name: res.data.user.name,
          role: res.data.user.role,
          isAdmin: res.data.user.isAdmin,
          profilePicture: res.data.user.profilePicture,
        };

        login(userObj, res.data.token);
        setUser(userObj);
        toast.success(res.data.message);
        setSuccess(res.data.message);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Login failed");
        setError(error.response?.data?.message || "Login failed");
      }
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col lg:flex-row max-h-[90vh] max-w-[780vw] item-center bg-gray-50 rounded-md shadow-lg overflow-hidden">
        <div className="flex flex-col items-center justify-center w-full py-12 px-4 sm:px-6 lg:px-8">
          {success && (
            <Notification
              isOpen={true}
              title="Success"
              message="Login successful"
              type="success"
              onClose={() => setSuccess("")}
              link="/dashboard"
            />
          )}

          {error && (
            <Notification
              isOpen={true}
              title="Error"
              message={error}
              type="error"
              onClose={() => setError("")}
            />
          )}

          <div className="w-full max-w-md space-y-8 px-2 py-12">
            <div className="flex items-center justify-center">
              <img src={config?.logo} alt="logo" className="w-[200px] h-[70px]" />
            </div>

            <form className="mt-8 space-y-6 font-sans" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={data.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={hide ? "password" : "text"}
                      required
                      value={data.password}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 pr-10"
                      placeholder="••••••••"
                    />
                    <img
                      src={hide ? "/hide.png" : "/view.png"}
                      onClick={() => setHide(!hide)}
                      alt="eye-icon"
                      className="absolute right-3 top-3 w-6 h-6 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-600 cursor-pointer disabled:opacity-50"
                disabled={isPending}
              >
                {isPending ? "Loading..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
