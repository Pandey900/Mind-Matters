import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  FaUser,
  FaUsers,
  FaLevelUpAlt,
  FaLanguage,
  FaShare,
  FaClock,
} from "react-icons/fa";
import { BiTime } from "react-icons/bi";
import { MdBookOnline } from "react-icons/md";
import useUser from "../../hooks/useUser";

const SingleClass = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, role } = useUser();
  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axiosFetch.get(`/class/${id}`);
        setCourse(response.data);
        checkEnrollmentStatus();
        fetchRelatedCourses();
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourseData();
  }, [id, axiosFetch]);

  const checkEnrollmentStatus = async () => {
    if (currentUser) {
      try {
        const response = await axiosSecure.get(
          `/enrolled-classes/${currentUser.email}`
        );
        setEnrolledClasses(response.data);
        setIsEnrolled(
          response.data.some(
            (enrolledCourse) => enrolledCourse.classes._id === id
          )
        );
      } catch (error) {
        console.error("Error checking enrollment status:", error);
      }
    }
  };

  const fetchRelatedCourses = async () => {
    try {
      const response = await axiosFetch.get("/active-classes");
      setRelatedCourses(response.data.filter((c) => c._id !== id).slice(0, 3));
    } catch (error) {
      console.error("Error fetching related courses:", error);
    }
  };

  const handleAddToCart = () => {
    console.log("handleAddToCart called with id:", id);

    if (!currentUser) {
      navigate("/login", { state: { from: `/classes/${id}`, classId: id } });
      return;
    }

    if (role === "admin" || role === "instructor") {
      console.error("Admins and instructors cannot add classes to cart");
      alert("Admins and instructors cannot add classes to cart");
      return;
    }

    if (course.availableseats < 1) {
      console.error("No seats available for this class");
      alert("No seats available for this class");
      return;
    }

    axiosSecure
      .get(`/cart-item/${id}?email=${currentUser?.email}`)
      .then((res) => {
        if (res.data.classId === id) {
          alert("Already Selected");
        } else if (enrolledClasses.find((item) => item.classes._id === id)) {
          alert("Already Selected");
        } else {
          axiosSecure
            .post("/add-to-cart", {
              userId: currentUser.email,
              classId: id,
            })
            .then((response) => {
              console.log("Class added to cart successfully", response.data);
              alert("Class added to cart successfully");
              return axiosSecure.get(`/enrolled-classes/${currentUser.email}`);
            })
            .then((res) => {
              setEnrolledClasses(res.data);
              setIsEnrolled(true);
            })
            .catch((err) => {
              console.error("Error adding class to cart:", err);
              alert("Error adding class to cart");
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching cart item:", error);
        alert("Error fetching cart item");
      });
  };

  if (!course) return <div>Loading...</div>;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f4",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <img
          src={course.image}
          alt={course.name}
          style={{ width: "100%", height: "1000px", objectFit: "cover" }}
        />

        <div style={{ padding: "20px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            {course.name}
          </h1>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <FaUser style={{ marginRight: "10px", color: "#666" }} />
              <span style={{ color: "#666" }}>
                Instructor: {course.instructorname}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <FaClock style={{ marginRight: "10px", color: "#666" }} />
              <span style={{ color: "#666" }}>
                Last Updated: {new Date(course.submitted).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div style={{ borderBottom: "1px solid #eee", marginBottom: "20px" }}>
            <ul style={{ display: "flex", listStyle: "none", padding: 0 }}>
              {["Overview", "Curriculum", "Instructor", "Reviews"].map(
                (tab) => (
                  <li
                    key={tab}
                    style={{
                      marginRight: "20px",
                      paddingBottom: "10px",
                      borderBottom:
                        activeTab === tab.toLowerCase()
                          ? "2px solid #007bff"
                          : "none",
                      cursor: "pointer",
                    }}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                  >
                    {tab}
                  </li>
                )
              )}
            </ul>
          </div>

          {activeTab === "overview" && (
            <div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                Course Description
              </h2>
              <p
                style={{
                  color: "#666",
                  lineHeight: "1.6",
                  marginBottom: "20px",
                }}
              >
                {course.discription}
              </p>

              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                What You Will Learn
              </h3>
              <ul
                style={{
                  listStyle: "disc",
                  paddingLeft: "20px",
                  marginBottom: "20px",
                }}
              >
                <li>Professional skill development</li>
                <li>In-depth understanding of yoga principles</li>
                <li>Practical techniques for teaching yoga</li>
                <li>Building a successful yoga career</li>
              </ul>
            </div>
          )}

          {activeTab === "curriculum" && (
            <div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                Course Content
              </h2>
              <div
                style={{
                  backgroundColor: "#f9f9f9",
                  padding: "15px",
                  borderRadius: "5px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>
                    Section 1: Introduction to Yoga
                  </span>
                  <span style={{ color: "#666", fontSize: "14px" }}>
                    3 lectures • 45 min
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "instructor" && (
            <div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                Instructor
              </h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <img
                  src={course.instructorImage}
                  alt={course.instructorname}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    marginRight: "20px",
                  }}
                />
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
                    {course.instructorname}
                  </h3>
                  <p style={{ color: "#666" }}>{course.instructorBio}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                Student Reviews
              </h2>
              {/* Add review components here */}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "20px auto",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
            ${course.price}
          </h2>
          <button
            onClick={handleAddToCart}
            disabled={isEnrolled}
            style={{
              backgroundColor: isEnrolled ? "#ccc" : "#007bff",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              cursor: isEnrolled ? "default" : "pointer",
            }}
          >
            {isEnrolled ? "Enrolled" : "Enroll Now"}
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "15px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <BiTime style={{ marginRight: "10px", color: "#666" }} />
            <span>Duration: 8 weeks</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MdBookOnline style={{ marginRight: "10px", color: "#666" }} />
            <span>Lectures: 24</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaUsers style={{ marginRight: "10px", color: "#666" }} />
            <span>Enrolled: {course.totalenrolled}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaLevelUpAlt style={{ marginRight: "10px", color: "#666" }} />
            <span>Level: {course.level || "Intermediate"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaLanguage style={{ marginRight: "10px", color: "#666" }} />
            <span>Language: {course.language || "English"}</span>
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Share This Course
          </h3>
          <div style={{ display: "flex", gap: "10px" }}>
            <FaShare style={{ color: "#007bff", cursor: "pointer" }} />
            {/* Add more share icons as needed */}
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "15px",
            }}
          >
            Related Courses
          </h3>
          {relatedCourses.map((relatedCourse) => (
            <div
              key={relatedCourse._id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <img
                src={relatedCourse.image}
                alt={relatedCourse.name}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  marginRight: "15px",
                }}
              />
              <div>
                <h4 style={{ fontWeight: "bold", marginBottom: "5px" }}>
                  {relatedCourse.name}
                </h4>
                <span style={{ color: "#666" }}>${relatedCourse.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleClass;
