import React, { useContext, useMemo, useState } from "react"
import { clipboard } from "electron"
import fs from "fs"
import {
  Header,
  EmptyState,
  ReactotronContext,
  timelineCommandResolver,
} from "reactotron-core-ui"
import { MdSearch, MdDeleteSweep } from "react-icons/md"
import { FaTimes } from "react-icons/fa"
import type { IconType } from "react-icons"
import styled from "styled-components"

// Minimal shape we read off a timeline command — avoids a hard dependency on
// reactotron-core-contract from the app package.
export interface TimelineCommandLike {
  type: string
  messageId: number
  payload?: { name?: string; [key: string]: any }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const List = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  padding-top: 4px;
  padding-right: 10px;
`
const SearchLabel = styled.p`
  padding: 0 10px;
  font-size: 14px;
  color: ${(props) => props.theme.foregroundDark};
`
const SearchInput = styled.input`
  border-radius: 4px;
  padding: 10px;
  flex: 1;
  background-color: ${(props) => props.theme.backgroundSubtleDark};
  border: none;
  color: ${(props) => props.theme.foregroundDark};
  font-size: 14px;
`
const ClearSearch = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding-left: 10px;
  color: ${(props) => props.theme.foregroundDark};
`

const readFile = (path: string) =>
  new Promise<string>((resolve, reject) => {
    fs.readFile(path, "utf-8", (err, data) => {
      if (err || !data) reject(new Error("Something failed"))
      else resolve(data)
    })
  })

export interface LoggerTabProps {
  title: string
  icon: IconType
  emptyText: string
  // Picks the commands this tab shows out of the full timeline stream.
  filter: (command: TimelineCommandLike) => boolean
}

// Renders a single logger's commands using the exact same renderers the
// Timeline uses (network request/response views, display cards, etc.), scoped
// to one logger's stream, with timeline-style search and clear. Newest first.
function LoggerTab({ title, emptyText, icon, filter }: LoggerTabProps) {
  const { sendCommand, commands, clearCommands, openDispatchModal } =
    useContext(ReactotronContext)
  const [search, setSearch] = useState("")

  const dispatchAction = (action: any) => sendCommand("state.action.dispatch", { action })

  const rows = useMemo(() => {
    const mine = commands.filter(filter)
    const q = search.trim().toLowerCase()
    const matched = q
      ? mine.filter((c) => {
          try {
            return JSON.stringify(c.payload).toLowerCase().includes(q)
          } catch {
            return false
          }
        })
      : mine
    return matched.reverse()
  }, [commands, filter, search])

  return (
    <Container>
      <Header
        title={title}
        actions={[
          {
            tip: "Clear",
            icon: MdDeleteSweep,
            onClick: () => {
              clearCommands()
            },
          },
        ]}
      />
      <SearchContainer>
        <SearchLabel>Search</SearchLabel>
        <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
        {search !== "" && (
          <ClearSearch onClick={() => setSearch("")}>
            <FaTimes size={24} />
          </ClearSearch>
        )}
        <SearchLabel>
          <MdSearch size={24} />
        </SearchLabel>
      </SearchContainer>
      {rows.length === 0 ? (
        <EmptyState icon={icon} title={emptyText} />
      ) : (
        <List>
          {rows.map((command) => {
            const CommandComponent = timelineCommandResolver(command.type)
            if (!CommandComponent) return null
            return (
              <CommandComponent
                key={command.messageId}
                command={command}
                copyToClipboard={clipboard.writeText}
                readFile={readFile}
                sendCommand={sendCommand}
                dispatchAction={dispatchAction}
                openDispatchDialog={openDispatchModal}
              />
            )
          })}
        </List>
      )}
    </Container>
  )
}

export default LoggerTab
