import { useState } from "react";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logIn } from "./features/userSlice.js";
import { ToastContainer } from "react-toastify";
// pages
import Home from "./pages/Home.jsx";
import SignUp from "./pages/SignUp.jsx";
import LogIn from "./pages/LogIn.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import Landing from "./pages/Landing.jsx";
import LogOut from "./pages/LogOut.jsx";
import Profile from "./pages/Profile.jsx";
import Social from "./pages/Social.jsx";
// components
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";

function App() {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [isNewHabitFormVisible, setIsNewHabitFormVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/check-login`,
          {
            credentials: "include",
          },
        );

        const result = await response.json();
        // console.log(result);

        if (result.success && result.data.isUserLoggedIn) {
          dispatch(
            logIn({
              fullName: result.data.fullName,
              email: result.data.email,
              memberSince: result.data.memberSince,
            }),
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return "";
  } else {
    return (
      <>
        <Routes>
          {/* routes with nav */}

          <Route
            element={
              <Layout
                isNewHabitFormVisible={isNewHabitFormVisible}
                setIsNewHabitFormVisible={setIsNewHabitFormVisible}
              />
            }
          >
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home
                    isNewHabitFormVisible={isNewHabitFormVisible}
                    setIsNewHabitFormVisible={setIsNewHabitFormVisible}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/social"
              element={
                <ProtectedRoute>
                  <Social />
                </ProtectedRoute>
              }
            />
            <Route
              path="/logout"
              element={
                <ProtectedRoute>
                  <LogOut />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* routes without nav */}

          <Route
            path="/landing"
            element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              <PublicRoute>
                <VerifyEmail />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LogIn />
              </PublicRoute>
            }
          />
        </Routes>
        <ToastContainer
          position="top-center"
          autoClose={1500} // 👈 global time (ms)
          hideProgressBar={false}
          newestOnTop={true}
          pauseOnHover
          draggable
        />
      </>
    );
  }
}

export default App;
