import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { UIProvider } from "../context/UIContext";

export function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>{children}</UIProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
