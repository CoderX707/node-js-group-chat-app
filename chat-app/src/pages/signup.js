import React, { useState } from "react";

const SignupForm = ({ submitCallback }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    submitCallback({
      formData,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Create User</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter Username"
              value={formData.username}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              id="signup-password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
};
export default SignupForm;
