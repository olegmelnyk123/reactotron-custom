import React, { useContext } from "react"
import { ReactotronContext } from "reactotron-core-ui"
import {
  MdReorder,
  MdAssignment,
  MdLiveHelp,
  MdWarning,
  MdOutlineMobileFriendly,
  MdMobiledataOff,
  MdLanguage,
  MdStorage,
  MdInsights,
} from "react-icons/md"
import { FaMagic } from "react-icons/fa"
import styled from "styled-components"

import SideBarButton from "../SideBarButton"
import { reactotronLogo } from "../../images"
import { ServerStatus } from "../../contexts/Standalone/useStandalone"

interface SideBarContainerProps {
  $isOpen: boolean
}
const SideBarContainer = styled.div.attrs(() => ({}))<SideBarContainerProps>`
  display: flex;
  flex-direction: column;
  padding-top: 25px;
  background-color: ${(props) => props.theme.backgroundSubtleDark};
  border-right: 1px solid ${(props) => props.theme.chromeLine};
  width: 115px;
  transition: margin 0.2s ease-out;
  margin-left: ${(props) => (props.$isOpen ? 0 : -115)}px;
`

const Spacer = styled.div`
  flex: 1;
`

function SideBar({ isOpen, serverStatus }: { isOpen: boolean; serverStatus: ServerStatus }) {
  // Analytics dot: green when GA logging is on, gray when off. The app persists
  // analytics_debug to AsyncStorage; Reactotron reports each write as an
  // asyncStorage.mutation. commands are newest-first, so the first matching
  // mutation is the latest value.
  const { commands } = useContext(ReactotronContext)
  const latestDebug = commands.find(
    (c) =>
      c.type === "asyncStorage.mutation" &&
      (c.payload as any)?.action === "setItem" &&
      (c.payload as any)?.data?.key === "analytics_debug",
  )
  const analyticsActive = String((latestDebug?.payload as any)?.data?.value) === "true"
  const analyticsDotColor = analyticsActive ? "#2ecc71" : "#6b6b6b"

  let serverIcon = MdMobiledataOff
  let iconColor
  let serverText = "Stopped"
  if (serverStatus === "started") {
    serverIcon = MdOutlineMobileFriendly
    serverText = "Running"
  }
  if (serverStatus === "portUnavailable") {
    serverIcon = MdWarning
    iconColor = "yellow"
    serverText = "Port 9090 unavailable"
  }

  const retryConnection = () => {
    if (serverStatus === "portUnavailable") {
      // TODO: Reconnect more elegantly than forcing a reload
      window.location.reload()
    }
  }

  return (
    <SideBarContainer $isOpen={isOpen}>
      <SideBarButton image={reactotronLogo} path="/" text="Home" hideTopBar />
      <SideBarButton icon={MdReorder} path="/timeline" text="Timeline" />
      <SideBarButton
        icon={MdAssignment}
        path="/state/subscriptions"
        matchPath="/state"
        text="State"
      />
      <SideBarButton icon={MdLanguage} path="/loggers/network" text="Network" />
      <SideBarButton icon={MdStorage} path="/loggers/mobx" text="MobX Actions" />
      <SideBarButton
        icon={MdInsights}
        path="/loggers/analytics"
        text="Analytics"
        dotColor={analyticsDotColor}
      />
      <SideBarButton icon={FaMagic} path="/customCommands" text="Custom Commands" iconSize={25} />

      <Spacer />

      <SideBarButton
        icon={serverIcon}
        path="#"
        onPress={retryConnection}
        text={serverText}
        iconColor={iconColor}
      />

      <SideBarButton icon={MdLiveHelp} path="/help" text="Help" hideTopBar />
    </SideBarContainer>
  )
}

export default SideBar
