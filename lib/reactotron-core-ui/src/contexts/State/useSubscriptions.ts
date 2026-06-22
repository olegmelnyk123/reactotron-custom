import { useReducer, useEffect, useCallback, useContext } from "react"

import ReactotronContext from "../Reactotron"

export enum StorageKey {
  Subscriptions = "ReactotronSubscriptions",
}

interface State {
  subscriptions: string[]
}

interface Action {
  type: "SUBSCRIPTIONS_SET"
  payload?: string | string[]
}

function subscriptionsReducer(state: State, action: Action) {
  switch (action.type) {
    case "SUBSCRIPTIONS_SET":
      return { ...state, subscriptions: action.payload as string[] }
    default:
      return state
  }
}

function useSubscriptions() {
  const { sendCommand } = useContext(ReactotronContext)

  const [state, dispatch] = useReducer(subscriptionsReducer, {
    subscriptions: [],
  })

  // Internal Handlers
  const sendSubscriptions = useCallback(
    (subscriptions: string[]) => {
      localStorage.setItem(StorageKey.Subscriptions, JSON.stringify(subscriptions))

      sendCommand("state.values.subscribe", { paths: subscriptions })
    },
    [sendCommand]
  )

  // Load up saved subscriptions!
  useEffect(() => {
    // Default to subscribing the whole store root ("") on first run so the State
    // tab shows live data without a manual subscription; a saved choice (even an
    // empty array after the user clears it) is respected once present.
    const stored = localStorage.getItem(StorageKey.Subscriptions)
    const subscriptions = stored ? JSON.parse(stored) : [""]

    dispatch({
      type: "SUBSCRIPTIONS_SET",
      payload: subscriptions,
    })

    // NOTE: we intentionally do NOT subscribe here. Subscribing globally on load
    // makes the app stream (and serialize) the store graph on every change even
    // when the State tab isn't open. The State page subscribes on mount and
    // pauses on unmount instead, so the app only streams while you're viewing it.
  }, [])

  // Setup event handlers
  const addSubscription = (path: string) => {
    if (state.subscriptions.indexOf(path) > -1) return

    const newSubscriptions = [...state.subscriptions, path]

    sendSubscriptions(newSubscriptions)

    dispatch({
      type: "SUBSCRIPTIONS_SET",
      payload: newSubscriptions,
    })
  }

  const removeSubscription = (path: string) => {
    const idx = state.subscriptions.indexOf(path)

    if (idx < 0) return;

    const newSubscriptions = [
      ...state.subscriptions.slice(0, idx),
      ...state.subscriptions.slice(idx + 1),
    ]

    sendSubscriptions(newSubscriptions)

    dispatch({
      type: "SUBSCRIPTIONS_SET",
      payload: newSubscriptions,
    })
  }

  const clearSubscriptions = () => {
    sendSubscriptions([])

    dispatch({
      type: "SUBSCRIPTIONS_SET",
      payload: [],
    })
  }

  return {
    subscriptions: state.subscriptions,
    addSubscription,
    removeSubscription,
    clearSubscriptions,
  }
}

export default useSubscriptions
