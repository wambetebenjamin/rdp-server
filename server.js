// Simple WebSocket signaling server
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

const clients = new Map(); // id -> ws

console.log(`Signaling server listening on ws://0.0.0.0:${PORT}`);

wss.on('connection', (ws) => {
  const id = uuidv4();
  clients.set(id, ws);
  ws.id = id;

  ws.send(JSON.stringify({ type: 'welcome', id }));

  ws.on('message', (msg) => {
    let data;
    try { data = JSON.parse(msg); } catch (e) { return; }

    if (data.type === 'signal' && data.to && data.data) {
      const target = clients.get(data.to);
      if (target && target.readyState === WebSocket.OPEN) {
        target.send(JSON.stringify({
          type: 'signal',
          from: ws.id,
          data: data.data
        }));
      } else {
        ws.send(JSON.stringify({ type: 'error', message: 'target-unavailable' }));
      }
    } else if (data.type === 'list') {
      ws.send(JSON.stringify({ type: 'list', ids: Array.from(clients.keys()).filter(x => x !== ws.id) }));
    }
  });

  ws.on('close', () => {
    clients.delete(id);
  });
});
