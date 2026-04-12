import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children, routeKey }) {
    // Check sessionStorage for required data 
    if (!routeKey) {
      // If not present, redirect to home or another page
      return <Navigate to="/" replace />;
    }

    // If data exists, render the child component
    return children;
  }