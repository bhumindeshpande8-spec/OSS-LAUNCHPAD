import { createContext, useCallback, useMemo, useState } from "react";

export const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const openMobileNav = useCallback(() => setMobileNavOpen(true), []);
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);
  const toggleTheme = useCallback(() => setTheme((current) => (current === "light" ? "dark" : "light")), []);

  const value = useMemo(
    () => ({ isMobileNavOpen, openMobileNav, closeMobileNav, theme, toggleTheme }),
    [closeMobileNav, isMobileNavOpen, openMobileNav, theme, toggleTheme]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
