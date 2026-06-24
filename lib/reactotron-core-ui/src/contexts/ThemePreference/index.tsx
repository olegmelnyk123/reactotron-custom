import React, { useContext } from "react"

import { ColorScheme } from "../../themes"
import { ThemeMode } from "../../hooks/useThemeMode"

interface Context {
  // The user's chosen preference: "light", "dark", or "system".
  mode: ThemeMode
  // The actual scheme applied after resolving "system" against the OS.
  resolvedScheme: ColorScheme
  setMode: (mode: ThemeMode) => void
}

const ThemePreferenceContext = React.createContext<Context>({
  mode: "system",
  resolvedScheme: "dark",
  setMode: () => {},
})

export const useThemePreference = () => useContext(ThemePreferenceContext)

export default ThemePreferenceContext
