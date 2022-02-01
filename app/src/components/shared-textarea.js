import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

function SharedTextarea(props) {
  const [value, setValue] = useState('');
  const [socket, setSocket] = useState();
  const { room } = useParams();
  useEffect(() => {
    let host = window.location.hostname;
    if (host === "localhost") host += ":3001";
    const s = io(host, { transports: ['websocket'], secure: true });
    s.emit('join-textarea', room);
    s.on('textarea', (v) => {
      setValue(v);
    });

    setSocket(s);
  }, []);

  function onChangeHandler(e) {
    setValue(e.target.value);
    socket.emit('textarea', e.target.value)
  }

  return (
    <textarea onChange={onChangeHandler} value={value} />
  );
}

export default SharedTextarea;
