import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children,storageKey }) {
    // Check sessionStorage for required data 
    const data = sessionStorage.getItem(storageKey);

    if (!data) {
      // If not present, redirect to home or another page
      return <Navigate to="/" replace />;
    }

    // If data exists, render the child component
    return children;
  }