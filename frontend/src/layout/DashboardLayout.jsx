import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { BiHomeAlt, BiLogInCircle, BiSelectMultiple } from "react-icons/bi";
import { FaHome, FaUsers } from "react-icons/fa";
import { TbBrandAppleArcade } from "react-icons/tb";
import { BsFillPostcardFill } from "react-icons/bs";
import useUser from "../hooks/useUser";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  MdExplore,
  MdOfflineBolt,
  MdPayments,
  MdPendingActions,
} from "react-icons/md";
import { GiFigurehead } from "react-icons/gi";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { IoSchoolSharp } from "react-icons/io5";
import { IoMdDoneAll } from "react-icons/io";
import { SiGoogleclassroom, SiInstructure } from "react-icons/si";
import Scroll from "../hooks/useScroll";
import { PacmanLoader } from "react-spinners";

const adminNavItems = [
  {
    to: "/dashboard/admin-home",
    icon: <BiHomeAlt className="text-2xl" />,
    label: "Dashboard Home",
  },
  {
    to: "/dashboard/manage-users",
    icon: <FaUsers className="text-2xl" />,
    label: "Manage Users",
  },
  {
    to: "/dashboard/manage-classes",
    icon: <BsFillPostcardFill className="text-2xl" />,
    label: "Manage Classes",
  },
  {
    to: "/dashboard/manage-applications",
    icon: <TbBrandAppleArcade className="text-2xl" />,
    label: "Applications",
  },
];

const instructorNavItem = [
  {
    to: "/dashboard/instructor-cp",
    icon: <FaHome className="text-2xl" />,
    label: "Home",
  },
  {
    to: "/dashboard/add-class",
    icon: <MdExplore className="text-2xl" />,
    label: "Add A Class",
  },
  {
    to: "/dashboard/my-classes",
    icon: <IoSchoolSharp className="text-2xl" />,
    label: "My Classes",
  },
  {
    to: "/dashboard/my-pending",
    icon: <MdPendingActions className="text-2xl" />,
    label: "Pending Classes",
  },
  {
    to: "/dashboard/my-approved",
    icon: <IoMdDoneAll className="text-2xl" />,
    label: "Home",
  },
];

const students = [
  {
    to: "/dashboard/student-cp",
    icon: <BiHomeAlt className="text-2xl" />,
    label: "Dashboard",
  },
  {
    to: "/dashboard/enrolled-class",
    icon: <SiGoogleclassroom className="text-2xl" />,
    label: "My Enroll",
  },
  {
    to: "/dashboard/my-selected",
    icon: <BiSelectMultiple className="text-2xl" />,
    label: "My Selected",
  },
  {
    to: "/dashboard/my-payments",
    icon: <MdPayments className="text-2xl" />,
    label: "Payment History",
  },
  {
    to: "/dashboard/apply-instructor",
    icon: <SiInstructure className="text-2xl" />,
    label: "Apply For Instructor",
  },
];
const lastItems = [
  {
    to: "/",
    icon: <BiHomeAlt className="text-2xl" />,
    label: "Home",
  },
  {
    to: "/trending",
    icon: <MdOfflineBolt className="text-2xl" />,
    label: "Trending",
  },
  {
    to: "/browse",
    icon: <GiFigurehead className="text-2xl" />,
    label: "Following",
  },
];

const DashboardLayout = () => {
  const [open, setOpen] = useState(true);
  const { loader, logout } = useAuth();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const role = currentUser?.role;

  const handleLogOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, you can Logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        logout()
          .then(
            Swal.fire({
              title: "Logged Out Successfully!",
              text: "Your file has been deleted.",
              icon: "success",
            })
          )
          .catch((error) => console.log(error));
      }
      navigate("/");
    });
  };

  if (loader) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PacmanLoader color="#1edee2" size={50} />
      </div>
    );
  }

  return (
    <div className="flex">
      <div
        className={`${
          open ? "w-27 overflow-y-auto" : "w-[200px] overflow-auto"
        } bg-white h-screen p-5 md:block hidden pt-8 relative duration-300`}
      >
        <div className="flex gap-4 items-center">
          <img
            onClick={() => setOpen(!open)}
            src="/yoga-logo.png"
            alt=""
            className={`cursor-pointer h-[90px] duration-500 ${
              open && "rotate-[360deg]"
            }`}
          />
          <Link to="/">
            <h1
              onClick={() => setOpen(!open)}
              className={`text-dark-primary cursor-pointer font-bold origin-left text-2xl duration-200 ${
                !open && "scale-0"
              }`}
            >
              MindMatters
            </h1>
          </Link>
        </div>

        {/* NavLinks */}

        {/* Admin Role */}
        {role === "admin" && (
          <ul className="pt-6">
            <p className={`ml-3 text-grey-400 mb-5 ${!open && "hidden"}`}>
              <small className="text-black-400 text-xl">MENU</small>
            </p>
            {adminNavItems.map((menuItem, index) => (
              <li key={index} className="mb-2">
                <NavLink
                  to={menuItem.to}
                  className={({ isActive }) =>
                    `flex ${
                      isActive ? "bg-red-500 text-white" : "text-[#413F44]"
                    } duration-150 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-bold text-sm items-center gap-x-4`
                  }
                >
                  {menuItem.icon}
                  <span
                    className={`${!open && "hidden"} origin-left duration-200`}
                  >
                    {menuItem.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        )}

        {/* Instructor Role */}
        {role === "instructor" && (
          <ul className="pt-6">
            <p className={`ml-3 text-grey-400 mb-5 ${!open && "hidden"}`}>
              <small className="text-black-400 text-xl">MENU</small>
            </p>
            {instructorNavItem.map((menuItem, index) => (
              <li key={index} className="mb-2">
                <NavLink
                  to={menuItem.to}
                  className={({ isActive }) =>
                    `flex ${
                      isActive ? "bg-red-500 text-white" : "text-[#413F44]"
                    } duration-150 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-bold text-sm items-center gap-x-4`
                  }
                >
                  {menuItem.icon}
                  <span
                    className={`${!open && "hidden"} origin-left duration-200`}
                  >
                    {menuItem.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        )}

        {/* Students Role */}

        {role === "user" && (
          <ul className="pt-6">
            <p className={`ml-3 text-grey-400 mb-5 ${!open && "hidden"}`}>
              <small className="text-black-400 text-xl">MENU</small>
            </p>
            {students.map((menuItem, index) => (
              <li key={index} className="mb-2">
                <NavLink
                  to={menuItem.to}
                  className={({ isActive }) =>
                    `flex ${
                      isActive ? "bg-red-500 text-white" : "text-[#413F44]"
                    } duration-150 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-bold text-sm items-center gap-x-4`
                  }
                >
                  {menuItem.icon}
                  <span
                    className={`${!open && "hidden"} origin-left duration-200`}
                  >
                    {menuItem.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        )}

        <ul className="pt-6">
          <p
            className={`ml-3 text-grey-500 uppercase mb-5 ${!open && "hidden"}`}
          >
            <small className="text-black-400 text-xl">USEFUL LINKS</small>
          </p>
          {lastItems.map((menuItem, index) => (
            <li key={index} className="mb-2">
              <NavLink
                to={menuItem.to}
                className={({ isActive }) =>
                  `flex ${
                    isActive ? "bg-red-500 text-white" : "text-[#413F44]"
                  } duration-150 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-bold text-sm items-center gap-x-4`
                }
              >
                {menuItem.icon}
                <span
                  className={`${!open && "hidden"} origin-left duration-200`}
                >
                  {menuItem.label}
                </span>
              </NavLink>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogOut}
              className="flex w-full duration-150 rounded-md p-2 cursor-pointer hover:bg-red-500 hover:text-white font-bold text-sm items-center gap-x-4"
            >
              <BiLogInCircle className="text-2xl" />
              <span className={`${!open && "hidden"} origin-left duration-300`}>
                Logout
              </span>
            </button>
          </li>
        </ul>
      </div>
      <div className="h-screen overflow-y-auto px-8 flex-1">
        <Scroll />
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
