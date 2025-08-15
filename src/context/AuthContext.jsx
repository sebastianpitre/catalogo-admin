import { createContext, useState, useEffect } from "react";
import { authenticatedUser } from "@/services/auth/authenticated";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authenticatedUser();

        const groupPermissions =
          data.groups?.flatMap((group) =>
            group.permissions.map((perm) => perm.codename)
          ) || [];

        const userPermissions =
          data.user_permissions?.map((perm) => perm.codename) || [];

        const allPermissions = [
          ...new Set([...groupPermissions, ...userPermissions]),
        ];

        const userData = {
          ...data,
          permissions: allPermissions, // ✅ agregado pero no rompe nada
          // ❌ NO modificar `groups`, porque necesitas los `.permissions` en cada grupo
        };

        setUser(userData);
      } catch (error) {
        console.log("No autenticado", error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
