import React from "react";
import HeroContainer from "./Hero/HeroContainer";
import Gallary from "./Gallary/Gallary";
import PopularClasses from "./PopularClasses/PopularClasses";
import PopularTeacher from "./PopularTeacher/PopularTeacher";

const Home = () => {
  console.log(import.meta.env.VITE_APIKEY);
  return (
    <div>
      <HeroContainer />
      <div className="max-w-screen-xl mx-auto">
        <Gallary />
        <PopularClasses />
        <PopularTeacher />
      </div>
    </div>
  );
};

export default Home;
