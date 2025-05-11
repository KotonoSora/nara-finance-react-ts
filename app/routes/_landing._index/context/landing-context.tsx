import { createContext, useContext } from "react";

const LandingContext = createContext<LandingPageContextType | null>(null);

export function useLandingContext() {
  const context = useContext(LandingContext);
  if (!context) {
    throw new Error(
      "useLandingContext must be used within a LandingContextProvider",
    );
  }
  return context;
}

export function LandingContextProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: LandingPageContextType;
}) {
  return (
    <LandingContext.Provider value={value}>{children}</LandingContext.Provider>
  );
}
