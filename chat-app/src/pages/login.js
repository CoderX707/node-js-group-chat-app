import React, { useState } from "react";

const LoginForm = ({ submitCallback }) => {
  const [formData, setFormData] = useState({
    username: "admin",
    password: "admin",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    submitCallback({
      ...formData,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              id="login-username"
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
              id="login-password"
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
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
export default LoginForm;
