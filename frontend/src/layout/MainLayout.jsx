import { Outlet } from "react-router-dom";
import Navbar from "../components/headers/Navbar";

const Mainlayout = () => {
  return (
    <main className="dark:bg-black overflow-hidden">
      <Navbar />
      <Outlet />
      <footer>Footer</footer>
    </main>
  );
};

export default Mainlayout;
