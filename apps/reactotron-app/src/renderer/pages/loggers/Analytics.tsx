import React from "react"
import { MdInsights } from "react-icons/md"

import LoggerTab from "./LoggerTab"

// 📈 analytics logger: display cards named "📈 <message>" with GA fields.
function Analytics() {
  return (
    <LoggerTab
      title="Analytics"
      icon={MdInsights}
      emptyText="No analytics events yet"
      filter={(c) => c.type === "display" && !!c.payload?.name?.startsWith("📈")}
    />
  )
}

export default Analytics
