import React from "react"
import styled from "styled-components"
import {
  MdSwapVert as ExpandIcon,
  MdSettings as SettingsIcon,
  MdShield as ShieldIcon,
  MdLightMode as LightIcon,
  MdDarkMode as DarkIcon,
  MdBrightnessAuto as SystemIcon,
} from "react-icons/md"
import type { ThemeMode } from "reactotron-core-ui"

import config from "../../config"
import {
  getPlatformName,
  getPlatformDetails,
  getConnectionName,
} from "../../util/connectionHelpers"
import { Connection, ServerStatus } from "../../contexts/Standalone/useStandalone"
import { McpStatus } from "../../contexts/Standalone"
import ConnectionSelector from "../ConnectionSelector"

const Container = styled.div`
  border-top: 1px solid ${(props) => props.theme.chromeLine};
  color: ${(props) => props.theme.foregroundDark};
  box-shadow: 0 0 30px ${(props) => props.theme.glow};
  color: ${(props) => props.theme.foregroundLight};
`

const ConnectionContainer = styled.div`
  display: flex;
  flex: 1;
  overflow-x: auto;
  height: 85px;
`

interface ContentContainerProps {
  $isOpen: boolean
}
const ContentContainer = styled.div.attrs(() => ({}))<ContentContainerProps>`
  display: flex;
  flex-direction: row;
  background-color: ${(props) => props.theme.subtleLine};
  padding: 0 10px;
  justify-content: space-between;
  align-items: center;
  cursor: ${(props) => (props.$isOpen ? "auto" : "pointer")};
  height: ${(props) => (props.$isOpen ? "85px" : "25px")};
`

const ConnectionInfo = styled.div`
  text-align: center;
`

const ExpandContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

interface McpButtonProps {
  $active: boolean
}

const McpGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`

const McpButton = styled.div.attrs(() => ({}))<McpButtonProps>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
  user-select: none;
  background-color: ${(props) => props.$active ? "rgba(80, 200, 120, 0.15)" : "transparent"};
  border: 1px solid ${(props) => props.$active ? "rgba(80, 200, 120, 0.4)" : props.theme.chromeLine};
  color: ${(props) => props.$active ? "#50c878" : props.theme.foregroundDark};
  &:hover {
    background-color: ${(props) => props.$active ? "rgba(80, 200, 120, 0.25)" : "rgba(255,255,255,0.05)"};
  }
`

const McpDot = styled.div<McpButtonProps>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${(props) => props.$active ? "#50c878" : props.theme.foregroundDark};
`

const McpSettingsButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
  color: ${(props) => props.theme.foregroundDark};
  &:hover {
    color: ${(props) => props.theme.foreground};
    background-color: rgba(255,255,255,0.05);
  }
`

const ThemeButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
  color: ${(props) => props.theme.foregroundDark};
  &:hover {
    color: ${(props) => props.theme.foreground};
    background-color: rgba(255, 255, 255, 0.05);
  }
`

const THEME_ICONS: Record<ThemeMode, React.ComponentType<{ size?: number }>> = {
  light: LightIcon,
  dark: DarkIcon,
  system: SystemIcon,
}

const RedactionBadge = styled.span<{ $warning?: boolean }>`
  display: flex;
  align-items: center;
  color: ${(props) => props.$warning ? "#e8a838" : "inherit"};
`

function renderExpanded(
  serverStatus: ServerStatus,
  connections: Connection[],
  selectedConnection: Connection | null,
  onChangeConnection: (clientId: string | null) => void
) {
  return (
    <ConnectionContainer>
      {connections.map((c) => (
        <ConnectionSelector
          key={c.id}
          selectedConnection={selectedConnection}
          connection={c}
          onClick={() => onChangeConnection(c.clientId)}
        />
      ))}
    </ConnectionContainer>
  )
}

function renderConnectionInfo(selectedConnection) {
  return selectedConnection
    ? `${getConnectionName(selectedConnection)} | ${getPlatformName(
        selectedConnection
      )} ${getPlatformDetails(selectedConnection)}`
    : "Waiting for connection"
}

function renderCollapsed(
  serverStatus: ServerStatus,
  connections: Connection[],
  selectedConnection: Connection | null
) {
  return (
    <>
      <ConnectionInfo>
        port {config.get("serverPort")} | {connections.length} connections
      </ConnectionInfo>
      {serverStatus === "portUnavailable" && (
        <ConnectionInfo>Port 9090 unavailable.</ConnectionInfo>
      )}
      {serverStatus === "started" && (
        <ConnectionInfo>{renderConnectionInfo(selectedConnection)}</ConnectionInfo>
      )}
      {serverStatus === "stopped" && <ConnectionInfo>Waiting for server to start</ConnectionInfo>}
    </>
  )
}

interface Props {
  serverStatus: ServerStatus
  connections: Connection[]
  selectedConnection: Connection | null
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onChangeConnection: (clientId: string | null) => void
  mcpStatus: McpStatus
  mcpPort: number | null
  onToggleMcp: () => void
  mcpRedactionEnforced: boolean
  onOpenMcpSettings: () => void
  themeMode: ThemeMode
  onCycleTheme: () => void
}

function Header({
  serverStatus,
  connections,
  selectedConnection,
  isOpen,
  setIsOpen,
  onChangeConnection,
  mcpStatus,
  mcpPort,
  onToggleMcp,
  mcpRedactionEnforced,
  onOpenMcpSettings,
  themeMode,
  onCycleTheme,
}: Props) {
  const renderMethod = isOpen ? renderExpanded : renderCollapsed
  const ThemeIcon = THEME_ICONS[themeMode]

  return (
    <Container>
      <ContentContainer onClick={() => !isOpen && setIsOpen(true)} $isOpen={isOpen}>
        {renderMethod(serverStatus, connections, selectedConnection, onChangeConnection)}
        <McpGroup>
          <McpButton
            $active={mcpStatus === "started"}
            onClick={(e) => { e.stopPropagation(); onToggleMcp() }}
            title={mcpStatus === "started" ? `MCP running on port ${mcpPort}` : "Start MCP server"}
          >
            <McpDot $active={mcpStatus === "started"} />
            {mcpStatus === "started" ? `MCP :${mcpPort}` : "MCP"}
            {mcpStatus === "started" && (
              mcpRedactionEnforced
                ? <RedactionBadge title="Sensitive data is redacted"><ShieldIcon size={10} /></RedactionBadge>
                : <RedactionBadge $warning title="Redaction disabled — sensitive data exposed"><ShieldIcon size={10} /></RedactionBadge>
            )}
          </McpButton>
          {mcpStatus === "started" && (
            <McpSettingsButton
              onClick={(e) => { e.stopPropagation(); onOpenMcpSettings() }}
              title="MCP redaction settings"
            >
              <SettingsIcon size={14} />
            </McpSettingsButton>
          )}
        </McpGroup>
        <ThemeButton
          onClick={(e) => { e.stopPropagation(); onCycleTheme() }}
          title={`Theme: ${themeMode} (click to change)`}
        >
          <ThemeIcon size={16} />
        </ThemeButton>
        <ExpandContainer onClick={() => setIsOpen(!isOpen)}>
          <ExpandIcon size={18} />
        </ExpandContainer>
      </ContentContainer>
    </Container>
  )
}

export default Header
