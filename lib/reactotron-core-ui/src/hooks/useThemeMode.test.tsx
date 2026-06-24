import { renderHook, act } from "@testing-library/react"
import useThemeMode, { THEME_MODE_STORAGE_KEY } from "./useThemeMode"

describe("useThemeMode", () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  it("defaults to system when nothing is stored", () => {
    const { result } = renderHook(() => useThemeMode())
    expect(result.current[0]).toBe("system")
  })

  it("reads a previously stored mode", () => {
    window.localStorage.setItem(THEME_MODE_STORAGE_KEY, "light")
    const { result } = renderHook(() => useThemeMode())
    expect(result.current[0]).toBe("light")
  })

  it("falls back to system for an invalid stored value", () => {
    window.localStorage.setItem(THEME_MODE_STORAGE_KEY, "neon")
    const { result } = renderHook(() => useThemeMode())
    expect(result.current[0]).toBe("system")
  })

  it("updates state and persists when setMode is called", () => {
    const { result } = renderHook(() => useThemeMode())

    act(() => {
      result.current[1]("dark")
    })

    expect(result.current[0]).toBe("dark")
    expect(window.localStorage.getItem(THEME_MODE_STORAGE_KEY)).toBe("dark")
  })
})
