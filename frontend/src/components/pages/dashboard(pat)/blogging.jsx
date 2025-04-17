import React from "react";
import "../css files patient/blogging.css"; // Import manual CSS
import { FaThumbsUp, FaStar, FaCheckCircle } from "react-icons/fa"; // Icons

const Blog = () => {
  const posts = [
    {
      id: 1,
      query: "What are the best ways to manage diabetes naturally?",
      user: "Rahul Sharma",
      doctor: {
        name: "Dr. Sneha Kapoor",
        specialization: "Endocrinologist",
        response:
          "Managing diabetes naturally involves a balanced diet, regular exercise, and staying hydrated. Avoid processed foods and include more fiber in your diet.",
        likes: 120,
        rating: 4.5,
        verified: true,
      },
    },
    {
      id: 2,
      query: "How can I improve my sleep cycle?",
      user: "Ananya Verma",
      doctor: {
        name: "Dr. Aman Mehta",
        specialization: "Neurologist",
        response:
          "Improving sleep involves maintaining a regular schedule, reducing screen time before bed, and avoiding caffeine in the evening.",
        likes: 85,
        rating: 4.0,
        verified: false,
      },
    },
    {
      id: 3,
      query: "What are the symptoms of vitamin D deficiency?",
      user: "Vikram Singh",
      doctor: {
        name: "Dr. Pooja Nair",
        specialization: "Nutritionist",
        response:
          "Common symptoms include fatigue, bone pain, muscle weakness, and depression. Sunlight exposure and vitamin D-rich foods can help.",
        likes: 200,
        rating: 5.0,
        verified: true,
      },
    },
  ];

  return (
    <div className="blog-container">
      <h2>Health Queries & Answers</h2>
      {posts.map((post) => (
        <div key={post.id} className="blog-card">
          <h3>{post.query}</h3>
          <p className="user-name">Asked by: {post.user}</p>

          <div className="doctor-response">
            <div className="doctor-info">
              <span className="doctor-name">{post.doctor.name}</span>
              {post.doctor.verified && (
                <FaCheckCircle className="verified-icon" />
              )}
            </div>
            <p className="doctor-specialization">
              {post.doctor.specialization}
            </p>
            <p className="response-text">{post.doctor.response}</p>
          </div>

          <div className="blog-footer">
            <div className="likes">
              <FaThumbsUp className="icon" />
              <span>{post.doctor.likes} Likes</span>
            </div>

            <div className="rating">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={
                    index < post.doctor.rating ? "star-filled" : "star-empty"
                  }
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Blog;
