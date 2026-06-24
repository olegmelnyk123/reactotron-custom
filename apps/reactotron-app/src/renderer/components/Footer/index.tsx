import React, { useContext, useState } from "react"
import { useThemePreference, ThemeMode } from "reactotron-core-ui"

import StandaloneContext from "../../contexts/Standalone"

import Footer from "./Stateless"

// Click order for the footer theme button.
const THEME_CYCLE: ThemeMode[] = ["light", "dark", "system"]

export default function ConnectedFooter() {
  const {
    serverStatus, connections, selectedConnection, selectConnection,
    mcpStatus, mcpPort, toggleMcp, mcpRedactionEnforced, openMcpSettings,
  } = useContext(StandaloneContext)
  const { mode: themeMode, setMode } = useThemePreference()
  const [isOpen, setIsOpen] = useState(false)

  const onCycleTheme = () => {
    const next = THEME_CYCLE[(THEME_CYCLE.indexOf(themeMode) + 1) % THEME_CYCLE.length]
    setMode(next)
  }

  return (
    <Footer
      serverStatus={serverStatus}
      connections={connections}
      selectedConnection={selectedConnection}
      onChangeConnection={selectConnection}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      mcpStatus={mcpStatus}
      mcpPort={mcpPort}
      onToggleMcp={toggleMcp}
      mcpRedactionEnforced={mcpRedactionEnforced}
      onOpenMcpSettings={openMcpSettings}
      themeMode={themeMode}
      onCycleTheme={onCycleTheme}
    />
  )
}
