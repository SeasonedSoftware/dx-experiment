import React, { useState, useCallback, useMemo, useRef } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

export default function WebsocketPage() {
  //Public API that will echo messages sent to it back to the client
  const [socketUrl, setSocketUrl] = useState('ws://localhost:3001/ws/someDomain/someAction');
  const messageHistory = useRef([]);

  const {
    sendMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl);

  messageHistory.current = useMemo(() =>
    messageHistory.current.concat(lastMessage),[lastMessage]);

  const handleClickChangeSocketUrl = useCallback(() =>
    setSocketUrl('ws://localhost:3001/ws/someDomain/someAction'), []);

  const handleClickSendMessage = useCallback(() =>
    sendMessage('Hello'), []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div>
      <button className="p-1 px-2 rounded border hover:border-red-700 dark:hover:border-green-500 border-transparent text-current border-red-600 dark:border-green-600"
        onClick={handleClickChangeSocketUrl}
      >
        Click Me to change Socket Url
      </button>
      <button className="p-1 px-2 rounded border hover:border-red-700 dark:hover:border-green-500 border-transparent text-current border-red-600 dark:border-green-600"
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Click Me to send 'Hello'
      </button>
      <span>The WebSocket is currently {connectionStatus}</span>
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      <ul>
        {messageHistory.current
          .map((message, idx) => <span key={idx}>{message ? message.data : null}</span>)}
      </ul>
    </div>
  )
}
