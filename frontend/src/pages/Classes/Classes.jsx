import React, { useContext, useEffect, useState } from "react";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import { Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../utilities/providers/AuthProvider";
import useUser from "../../hooks/useUser";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const { currentUser } = useUser();
  const role = currentUser?.role;
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log("The current user", user);

  const handleHover = (index) => {
    setHoveredCard(index);
  };

  // New function to clear the cart
  const clearCart = async () => {
    if (currentUser?.email) {
      try {
        await axiosSecure.delete(`/clear-cart/${currentUser?.email}`);
        console.log("Cart cleared successfully");
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    }
  };

  useEffect(() => {
    axiosFetch
      .get("/classes")
      .then((res) => setClasses(res.data))
      .catch((err) => console.log(err));

    // Clear the cart when a new user logs in
    if (currentUser?.email) {
      clearCart();
    }
  }, [currentUser]);

  const handleAddToCart = (id) => {
    console.log("handleAddToCart called with id:", id);

    if (!currentUser) {
      // Redirect to login page if user is not logged in
      navigate("/login", { state: { from: `/classes`, classId: id } });
      return;
    }

    if (role === "admin" || role === "instructor") {
      console.error("Admins and instructors cannot add classes to cart");
      // You might want to use a toast or alert here to show the error to the user
      return;
    }

    const selectedClass = classes.find((cls) => cls._id === id);

    if (selectedClass.availableseats < 1) {
      console.error("No seats available for this class");
      // You might want to use a toast or alert here to show the error to the user
      return;
    }

    // If user is logged in and all checks pass, add to cart
    axiosSecure
      .get(`/cart-item/${id}?email=${currentUser?.email}`)
      .then((res) => {
        if (res.data.classId === id) {
          alert("Already Selected");
        } else if (enrolledClasses.find((item) => item.classes._id === id)) {
          alert("Already Selected");
        } else {
          const data = {
            classId: id,
            userMail: currentUser?.email,
            date: new Date(),
          };

          // Add the class to the cart
          axiosSecure
            .post("/add-to-cart", {
              userId: currentUser.email,
              classId: id,
            })
            .then((response) => {
              console.log("Class added to cart successfully", response.data);
              // Optionally show a success message to the user
              alert("Class added to cart successfully");

              // Fetch the updated list of enrolled classes
              return axiosSecure.get(`/enrolled-classes/${currentUser.email}`);
            })
            .then((res) => {
              setEnrolledClasses(res.data);
            })
            .catch((err) => {
              console.error("Error adding class to cart:", err);
              // Optionally show an error message to the user
              alert("Error adding class to cart");
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching cart item:", error);
        // Optionally show an error message to the user
        alert("Error fetching cart item");
      });
  };

  return (
    <div>
      <div className="mt-20 pt-3">
        <h1 className="text-4xl font-bold text-center text-secondary">
          Classes
        </h1>
      </div>
      <div className="my-16 w-[90%] mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {classes.map((cls, index) => (
          <div
            onMouseLeave={() => handleHover(null)}
            key={index}
            className={`relative hover:-translate-y-2 duration-150 hover:ring-[2px] hover:ring-secondary w-64  mx-auto ${
              cls.availableseats < 1 ? "bg-red-300" : "bg-white"
            } dark:bg-slate-600 rounded-lg shadow-lg overflow-hidden cursor-pointer`}
            onMouseEnter={() => handleHover(index)}
          >
            <div className="relative h-48">
              <div
                className={`absolute inset-0 bg-black opacity-0 transition-opacity duration-300 ${
                  hoveredCard === index ? "opacity-60" : ""
                }`}
              />
              <img
                src={cls.image}
                alt=""
                className="object-cover w-full h-full"
              />

              <Transition show={hoveredCard === index}>
                <div className="transition duration-300 ease-in data-[closed]:opacity-0">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => handleAddToCart(cls._id)}
                      disabled={
                        role === "admin" ||
                        role === "instructor" ||
                        cls.availableseats < 1
                      }
                      className="px-4 py-2 text-white disabled:bg-red-700 bg-secondary duration-300 rounded hover:bg-red-700"
                    >
                      {currentUser ? "Add to Cart" : "Login to Add"}
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
            {/* Details */}
            <div className="px-6 py-2">
              <h3 className="font-bold mb-2">{cls.name}</h3>
              <p className="text-black-500 text-xm">
                Instructor: {cls.instructorname}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-black-600 text-xm">
                  Available Seats: {cls.availableseats}
                </span>
                <span className="text-black-500">${cls.price}</span>
              </div>
              <Link to={`/class/${cls._id}`}>
                <button className="px-4 py-2 m-4 mb-2 w-full mx-auto text-white disabled:bg-red-300 bg-secondary duration-300 rounded hover:bg-red-700">
                  View
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classes;
