import io from "socket.io-client";

let socket;

const connectSocket = () => {
  socket = io("http://localhost:4000");

  return socket;
};

export { socket, connectSocket };
