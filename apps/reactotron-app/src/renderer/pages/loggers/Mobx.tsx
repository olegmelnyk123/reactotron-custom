import React from "react"
import { MdStorage } from "react-icons/md"

import LoggerTab from "./LoggerTab"

// 🗄️ MobX logger: display cards named "🗄️ <store>" with batched actions.
function Mobx() {
  return (
    <LoggerTab
      title="MobX Actions"
      icon={MdStorage}
      emptyText="No MobX actions yet"
      filter={(c) => c.type === "display" && !!c.payload?.name?.startsWith("🗄️")}
    />
  )
}

export default Mobx
