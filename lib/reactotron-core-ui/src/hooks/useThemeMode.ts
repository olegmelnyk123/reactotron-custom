import React from "react"

export type ThemeMode = "light" | "dark" | "system"

export const THEME_MODE_STORAGE_KEY = "reactotron.themeMode"

// Order used when cycling through modes in the UI.
export const THEME_MODES: ThemeMode[] = ["light", "dark", "system"]

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system"
}

function readStoredMode(): ThemeMode {
  if (typeof window === "undefined" || !window.localStorage) return "system"
  const stored = window.localStorage.getItem(THEME_MODE_STORAGE_KEY)
  return isThemeMode(stored) ? stored : "system"
}

function useThemeMode(): [ThemeMode, (mode: ThemeMode) => void] {
  const [mode, setModeState] = React.useState<ThemeMode>(readStoredMode)

  const setMode = React.useCallback((next: ThemeMode) => {
    setModeState(next)
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(THEME_MODE_STORAGE_KEY, next)
    }
  }, [])

  return [mode, setMode]
}

export default useThemeMode
