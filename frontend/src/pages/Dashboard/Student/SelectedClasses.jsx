import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { PacmanLoader } from "react-spinners";
import moment from "moment";
import { MdDeleteSweep } from "react-icons/md";
import { FiDollarSign } from "react-icons/fi";
import Swal from "sweetalert2";
import useUser from "../../../hooks/useUser";

const SelectedClasses = () => {
  const { currentUser, isLoading: userLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    console.log("Current user:", currentUser);
    console.log("User loading:", userLoading);
    if (currentUser?.email && !userLoading) {
      setLoading(true);
      axiosSecure
        .get(`/cart/${currentUser?.email}`)
        .then((res) => {
          console.log("Cart data received:", res.data);
          setClasses(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching cart items:", error);
          setClasses([]);
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to load cart items. Please try again later.",
          });
        });
    }
  }, [currentUser, userLoading, axiosSecure]);

  const handlePay = (id) => {
    const item = classes.find((item) => item._id === id);
    console.log(id);
    // Implement payment logic here
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/delete-cart-item-objectid/${id}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
              });
              const newClasses = classes.filter((item) => item._id !== id);
              setClasses(newClasses);
            }
          })
          .catch((error) => {
            console.error("Error deleting item:", error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Failed to delete item. Please try again.",
            });
          });
      }
    });
  };

  const handleClearCart = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will clear your entire cart. You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clear it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/clear-cart/${currentUser?.email}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              Swal.fire({
                title: "Cleared!",
                text: "Your cart has been cleared.",
                icon: "success",
              });
              setClasses([]);
            }
          })
          .catch((error) => {
            console.error("Error clearing cart:", error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Failed to clear cart. Please try again.",
            });
          });
      }
    });
  };

  if (loading || userLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PacmanLoader color="#1edee2" size={50} />
      </div>
    );
  }

  const paginatedClasses = classes.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div>
      <div className="my-6 text-center">
        <h1 className="text-4xl font-bold">
          My <span className="text-secondary">Selected Classes</span>
        </h1>
      </div>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Shopping Cart</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-3/4">
              <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Cart Items</h3>
                  <button
                    onClick={handleClearCart}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                  >
                    Clear Cart
                  </button>
                </div>
                {classes.length === 0 ? (
                  <div className="text-center mt-10">
                    <h2 className="text-2xl font-bold">Your cart is empty</h2>
                    <p>Add some classes to see them here!</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left font-semibold px-4 py-2">#</th>
                        <th className="text-left font-semibold px-4 py-2">
                          Product
                        </th>
                        <th className="text-left font-semibold px-4 py-2">
                          Prices
                        </th>
                        <th className="text-left font-semibold px-4 py-2">
                          Date
                        </th>
                        <th className="text-left font-semibold px-4 py-2">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedClasses.map((item, index) => {
                        const letIndex = (page - 1) * itemsPerPage + index + 1;
                        return (
                          <tr key={item._id}>
                            <td className="py-4">{letIndex}</td>
                            <td className="py-4">
                              <div className="flex items-center">
                                <img
                                  src={item.image}
                                  alt=""
                                  className="h-16 w-16 mr-4"
                                />
                                <span>{item.name}</span>
                              </div>
                            </td>
                            <td>{item.price}</td>
                            <td className="py-4">
                              <p className="text-green-700 text-sm">
                                {moment(item.submitted).format("MMMM Do YYYY")}
                              </p>
                            </td>
                            <td className="py-4 flex pt-8 gap-2">
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="px-3 py-1 cursor-pointer bg-red-500 rounded-3xl text-white font-bold"
                              >
                                <MdDeleteSweep />
                              </button>
                              <button
                                onClick={() => handlePay(item._id)}
                                className="px-3 py-1 cursor-pointer bg-green-500 rounded-3xl text-white font-bold flex items-center"
                              >
                                <FiDollarSign className="mr-2" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
              {classes.length > 0 && (
                <div className="flex justify-center mt-4">
                  {Array.from(
                    { length: Math.ceil(classes.length / itemsPerPage) },
                    (_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`mx-1 px-3 py-1 rounded ${
                          page === i + 1
                            ? "bg-secondary text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {i + 1}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
            <div className="md:w-1/5 fixed right-3">
              {/* Add content for the right div here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedClasses;
