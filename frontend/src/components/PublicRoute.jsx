import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);

  if (isUserLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicRoute;
