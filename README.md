# Signaling Server

Simple WebSocket signaling server used to exchange WebRTC SDP and ICE between peers.

Run locally:
```
cd signaling-server
npm install
npm start
```

Run with Docker:
```
docker build -t rdp-signaling-server signaling-server
docker run -p 8080:8080 rdp-signaling-server
```
