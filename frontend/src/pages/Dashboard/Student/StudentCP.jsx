import React from "react";
import useUser from "../../../hooks/useUser";
import WelcomeImg from "../../../assets/dashboard/urban-welcome.svg";
import { Link } from "react-router-dom";

const StudentCP = () => {
  const { currentUser } = useUser();
  return (
    <div className="min-h-screen flex justify-center items-center p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-2xl sm:text-3xl md:text-4xl capitalize font-bold text-center mb-4 sm:mb-6">
          Hi, <span className="text-secondary">{currentUser?.name}</span>{" "}
          <br className="hidden sm:inline" />
          <span className="sm:hidden"> - </span>
          Welcome To The DashBoard
        </h1>
        <div className="flex justify-center mb-4 sm:mb-6">
          <img
            onContextMenu={(e) => e.preventDefault()}
            src={WelcomeImg}
            alt="Welcome"
            className="h-[200px] sm:h-[300px] md:h-[400px] w-auto object-contain"
            loading="lazy"
          />
        </div>
        <p className="text-center text-base sm:text-lg md:text-xl py-2 sm:py-4 font-semibold px-2">
          Hey, {currentUser?.name}! This is your DashBoard. Please have
          patience, your page is getting ready.
        </p>

        <div className="text-center mt-4 sm:mt-6">
          <h2 className="font-bold mb-2 sm:mb-4 text-lg sm:text-xl">
            You can jump to any page as per your choice from here:
          </h2>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 my-4">
            <LinkButton to="/dashboard/enrolled-class">My Enroll</LinkButton>
            <LinkButton to="/dashboard/my-selected">My Selected</LinkButton>
            <LinkButton to="/dashboard/my-payments">My Payments</LinkButton>
            <LinkButton to="/dashboard/apply-instructor">
              Join As An Instructor
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
};

const LinkButton = ({ to, children }) => (
  <Link
    to={to}
    className="border border-secondary rounded-lg hover:bg-secondary hover:text-white transition duration-200 px-3 py-2 text-sm sm:text-base inline-block"
  >
    {children}
  </Link>
);

export default StudentCP;
