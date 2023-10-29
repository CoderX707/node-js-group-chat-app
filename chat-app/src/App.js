import React, { useState, useEffect } from "react";
import LoginForm from "./pages/login";
import Dashboard from "./pages/dashboard";
import { checkAuth, loginRequest, logoutRequest } from "./Helpers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LOGIN_PAGE = "login";
const DASHBOARD_PAGE = "dashboard";

function App() {
  const [currentPage, setCurrentPage] = useState(LOGIN_PAGE);

  useEffect(() => {
    if (checkAuth().success) {
      setCurrentPage(DASHBOARD_PAGE);
    } else {
      setCurrentPage(LOGIN_PAGE);
    }
  }, [currentPage]);
  return (
    <div>
      {currentPage === LOGIN_PAGE ? (
        <LoginForm
          submitCallback={async (value) => {
            const result = await loginRequest(value);
            if (result && result.success) {
              setCurrentPage(DASHBOARD_PAGE);
              toast("Login success");
            } else {
              toast("Please check your credentials");
            }
          }}
        />
      ) : currentPage === DASHBOARD_PAGE ? (
        <Dashboard
          handleLogout={() => {
            setCurrentPage(LOGIN_PAGE);
            logoutRequest();
          }}
        />
      ) : null}
      <ToastContainer />
    </div>
  );
}

export default App;
