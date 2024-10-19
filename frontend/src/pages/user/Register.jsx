import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import {
  AiOutlineLock,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlinePicture,
  AiOutlineUser,
  AiOutlineHome,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import GoogleLogin from "../../components/headers/Social/GoogleLogin";
import { AuthContext } from "../../utilities/providers/AuthProvider";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const { signUp, updateUser, setError } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    setError(" ");
    console.log(data);
    signUp(data.email, data.password).then((result) => {
      const user = result.user;
      if (user) {
        return updateUser(data.name, data.photoUrl)
          .then(() => {
            const userImp = {
              email: user?.email,
              name: user?.displayName,
              photoUrl: user?.photoUrl,
              role: "user",
              gender: data.gender,
              phone: data.phone,
              address: data.address,
            };
            if (user.email && user.displayName) {
              return axios
                .post("http://localhost:3000/new-user", userImp)
                .then(() => {
                  navigate("/");
                  return "Registration Successful!";
                })
                .catch((err) => {
                  throw new Error(err);
                });
            }
          })
          .catch((err) => {
            setError(err.code);
            throw new Error(err);
          });
      }
    });
  };

  return (
    <div className="flex justify-center items-center pt-14 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-6">Please Register</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full md:w-1/2 px-3 mb-4">
              <div className="p-4 border rounded-md bg-gray-50">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-bold mb-2"
                >
                  <AiOutlineUser className="inline-block mr-2 mb-1 text-lg" />
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  {...register("name", { required: true })}
                  className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 px-3 mb-4">
              <div className="p-4 border rounded-md bg-gray-50">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-bold mb-2"
                >
                  <AiOutlineMail className="inline-block mr-2 mb-1 text-lg" />
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  {...register("email", { required: true })}
                  className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 px-3 mb-4">
              <div className="p-4 border rounded-md bg-gray-50">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-bold mb-2"
                >
                  <AiOutlineLock className="inline-block mr-2 mb-1 text-lg" />
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", { required: true })}
                  className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 px-3 mb-4">
              <div className="p-4 border rounded-md bg-gray-50">
                <label
                  htmlFor="confirmpassword"
                  className="block text-gray-700 font-bold mb-2"
                >
                  <AiOutlineLock className="inline-block mr-2 mb-1 text-lg" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm Your Password"
                  {...register("confirmpassword", {
                    required: true,
                    validate: (value) =>
                      value === watch("password") || "Password does not match",
                  })}
                  className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 px-3 mb-4">
              <div className="p-4 border rounded-md bg-gray-50">
                <label
                  htmlFor="phone"
                  className="block text-gray-700 font-bold mb-2"
                >
                  <AiOutlinePhone className="inline-block mr-2 mb-1 text-lg" />
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="Enter your number"
                  {...register("phone", { required: true })}
                  className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 px-3 mb-4">
              <div className="p-4 border rounded-md bg-gray-50">
                <label
                  htmlFor="photoUrl"
                  className="block text-gray-700 font-bold mb-2"
                >
                  <AiOutlinePicture className="inline-block mr-2 mb-1 text-lg" />
                  PhotoUrl
                </label>
                <input
                  type="text"
                  placeholder="Photo URL"
                  {...register("photoUrl")}
                  className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 px-3 mb-4">
              <div className="p-4 border rounded-md bg-gray-50">
                <label
                  htmlFor="gender"
                  className="block text-gray-700 font-bold mb-2"
                >
                  <AiOutlineUser className="inline-block mr-2 mb-1 text-lg" />
                  Gender
                </label>
                <select
                  {...register("gender", { required: true })}
                  className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="w-full px-3 mb-4">
              <div className="p-4 border rounded-md bg-gray-50">
                <label
                  htmlFor="address"
                  className="block text-gray-700 font-bold mb-2"
                >
                  <AiOutlineHome className="inline-block mr-2 mb-1 text-lg" />
                  Address
                </label>
                <textarea
                  placeholder="Enter your address"
                  {...register("address", { required: true })}
                  className="w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
            >
              Register
            </button>
            {errors.password && (
              <div className="text-red-500 text-sm w-full mt-1">
                <p>Pasowrd Doesn't Match</p>
              </div>
            )}
          </div>
        </form>
        <p className="text-center mt-4">
          Already have an account?
          <Link to="/login" className="underline text-secondary ml-2">
            Login
          </Link>
        </p>
        <GoogleLogin />
      </div>
    </div>
  );
};

export default Register;
