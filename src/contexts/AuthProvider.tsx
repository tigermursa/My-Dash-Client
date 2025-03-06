// import { createContext, useContext, ReactNode } from "react";
// import useAuth from "../hooks/useAuth";

// interface AuthContextType {
//   user: { _id: string; username: string; email: string } | null;
//   isLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const userId = localStorage.getItem(null); // Get stored user ID
//   const { user, isLoading } = useAuth(userId || "");

//   return (
//     <AuthContext.Provider value={{ user, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use authentication context
// export const useAuthContext = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuthContext must be used within an AuthProvider");
//   }
//   return context;
// };
