import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreatePost() {
  /* Component state */
  // Form data
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    tags: "",
    content: "",
  });
  /* Value to enable/disable the submit button */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); /* Error message */
  const crudServiceUrl = "/api/crud"; /* API endpoint */
  const navigate = useNavigate();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Submit the form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      /* Send form data to the backend */
      const newPost = await axios.post(`${crudServiceUrl}/posts`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      const newPostId = newPost.data._id;
      const postPath = `/post/${newPostId}`;
      if (window.confirm('Post created! Would you like to view the new post?')) {
        navigate(postPath);
      } else {
        setFormData({
          title: "",
          author: "",
          tags: "",
          content: "",
        });
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      setErrorMessage("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="create-post">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          value={formData.tags}
          onChange={handleInputChange}
        />
        <textarea
          name="content"
          placeholder="Write your content here..."
          value={formData.content}
          onChange={handleInputChange}
          rows="10"
          required
        ></textarea>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create Post"}
        </button>
      </form>

      {errorMessage && (
        <p className="error-message">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default CreatePost;
