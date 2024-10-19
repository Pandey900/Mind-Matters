import React from "react";
import { Link } from "react-router-dom";

const Card = ({ item }) => {
  const {
    _id,
    name,
    image,
    availableseats,
    price,
    totalenrolled,
    instructorname,
  } = item;

  return (
    <div className="shadow-lg rounded-lg p-3 flex flex-col justify-between border border-secondary overflow-hidden m-4">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="mt-2">
        <h3 className="font-bold text-lg">{name}</h3>
        <p>Instructor: {instructorname}</p>
        <p>Available Seats: {availableseats}</p>
        <p>Price: ${price}</p>
        <p>Total Enrolled: {totalenrolled}</p>
        <Link to={`class/${_id}`} className="text-center mt-2">
          <button className="px-2 w-full py-1 bg-secondary rounded-xl text-white font-bold mt-2">
            Select
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Card;
