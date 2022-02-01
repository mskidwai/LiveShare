import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css'

function SharedTerminal(props) {
  const terminalRef = useRef();
  const { room } = useParams();
  useEffect(() => {
    let host = window.location.hostname;
    if (host === "localhost") host += ":3001";
    const s = io(host, { transports: ['websocket'], secure: true });
    s.emit('join-terminal', room);

    const t = new Terminal();
    t.open(terminalRef.current);
    s.on('stdo', (v) => {
      t.write(v);
    });
    t.onData(stdin => {
      s.emit('stdin', stdin);
    });

  }, []);

  return (
    <div ref={terminalRef} />
  );
}

export default SharedTerminal;
