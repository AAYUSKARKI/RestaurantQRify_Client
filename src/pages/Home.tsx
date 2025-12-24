import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { Login } from "@/components/auth/Login";

export default function Home() {
  const navigate = useNavigate();
  const { user, loading } = useAppSelector((state) => state.auth);
  
  const isAuthenticated = !!user;

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
       <Login/>
    </div>
  );
}