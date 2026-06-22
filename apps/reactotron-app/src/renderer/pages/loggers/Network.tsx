import React from "react"
import { MdLanguage } from "react-icons/md"

import LoggerTab from "./LoggerTab"

// 🌐 network logger: SSL-pinned API calls surfaced via apiResponse.
function Network() {
  return (
    <LoggerTab
      title="Network"
      icon={MdLanguage}
      emptyText="No network calls yet"
      filter={(c) => c.type === "api.response"}
    />
  )
}

export default Network
