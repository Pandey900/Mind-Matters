import React, { useEffect, useState } from "react";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import img from "../../../assets/home/girl.jpg";
const PopularTeacher = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosFetch = useAxiosFetch();

  useEffect(() => {
    setLoading(true);
    axiosFetch
      .get("/popular-instructors")
      .then((response) => {
        setInstructors(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching instructors:", err);
        setError("Failed to load instructors. Please try again later.");
        setLoading(false);
      });
  }, [axiosFetch]);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="md:w-[80%] mx-auto my-36">
      <h1 className="text-5xl font-bold text-center mb-4">
        Our <span className="text-secondary">Best</span> Instructors
      </h1>
      <p className="text-gray-500 text-center mx-auto mb-12 max-w-2xl">
        Explore Our Best Instructors. Here are some popular instructors based on
        student enrollment.
      </p>

      {instructors.length > 0 ? (
        <div className="grid mb-28 md:grid-cols-2 lg:grid-flow-cols-4 w-[90%] gap-4 mx-auto">
          {instructors?.slice(0, 6).map((instructor, index) => (
            <div
              key={index}
              className="flex dark:text-white hover:-translate-y-2 duration-200 cursor-pointer flex-col shadow-md py-8 px-10 md:px-8 rounded-md"
            >
              <img
                className="rounded-full border-4 border-gray-300 h-24 w-24 mx-auto"
                src={instructor?.instructor?.photoUrl || `${img}`}
                alt={instructor.instructor.name}
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  {instructor.instructor.name}
                </h2>
                <p className="text-gray-600 mb-4">
                  {instructor.instructor.about}
                </p>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {instructor.instructor.email}
                  </p>
                  <p>
                    <span className="font-semibold">Enrolled:</span>{" "}
                    {instructor.totalEnrolled}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center mt-8">No instructors found.</p>
      )}
    </div>
  );
};

export default PopularTeacher;
