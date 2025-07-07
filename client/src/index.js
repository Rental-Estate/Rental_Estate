import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import AOS from "aos";
import "aos/dist/aos.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

const Root = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <React.StrictMode>
      <GoogleOAuthProvider clientId="954269391926-ja1qfcdvivufitr8jeqr33rlt6g5stoh.apps.googleusercontent.com">
        <AuthProvider>
          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
          <App />
        </AuthProvider>
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);