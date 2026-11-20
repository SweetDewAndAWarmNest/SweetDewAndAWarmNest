import { Hub } from './components/Hub';
import type { ChatMessage } from './components/Hub';

export default function App() {
  const roomId = `nest-${Date.now()}`;
  const chat: ChatMessage[] = [];
  const handleSendMessage = () => {};

  return (
    <div className="app">
      <Hub roomId={roomId} chat={chat} onSendMessage={handleSendMessage} />
    </div>
  );
}
