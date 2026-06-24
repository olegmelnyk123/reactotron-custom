import React from "react"
import styled, { ThemeProvider } from "styled-components"

import useColorScheme from "../../hooks/useColorScheme"
import useThemeMode from "../../hooks/useThemeMode"
import ThemePreferenceContext from "../../contexts/ThemePreference"
import { themes } from "../../themes"

const ReactotronContainer = styled.div`
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 0.94em;
  width: 100%;
  height: 100%;
  user-select: none;
`

const ReactotronAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme()
  const [mode, setMode] = useThemeMode()
  const resolvedScheme = mode === "system" ? systemScheme : mode

  return (
    <ThemePreferenceContext.Provider value={{ mode, resolvedScheme, setMode }}>
      <ThemeProvider theme={themes[resolvedScheme]}>
        <ReactotronContainer>{children}</ReactotronContainer>
      </ThemeProvider>
    </ThemePreferenceContext.Provider>
  )
}

export default ReactotronAppProvider
