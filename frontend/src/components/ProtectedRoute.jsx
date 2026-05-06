import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);

  if (!isUserLoggedIn) {
    return <Navigate to="/landing" />;
    // window.location.replace("/landing"); // this fully replaces in browser history
    // return null;
  } else {
    return children;
  }
}

export default ProtectedRoute;
