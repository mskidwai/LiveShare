import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
//import { useRef } from 'react';





function SharedTextarea(props) {
  const [value, _setValue] = useState('');
  const [socket, setSocket] = useState();
  const valueRef = useRef();
  const setValue = (data) => {
    valueRef.current = data;
    _setValue(data);
    //console.log('Current value ${valueRef.current}');
  };
  const { room } = useParams();
  useEffect(() => {
    let host = window.location.hostname;
    if (host === "localhost") host += ":3001";
    
    const s = io(host, { transports: ['websocket'], secure: true });
    
    s.emit('join-textarea', room);

    //Gets the value and sends it to the new state it received
    s.on('userconnect', (justJoinedId) => {
      
      //Emit to existing value the new value reference
      //s.emit('existingvalue', {giveValueToId: justJoinedId, valueRef.current.concat(data)});
      s.emit('existingvalue', {giveValueToThisId: justJoinedId, value: valueRef.current});

      console.log('emitting existing value', justJoinedId, valueRef.current);
      
      //console.log('User has joined. obtained old value');
    });

    
    s.on('textarea', (v) => {
      setValue(v);
      //Emits the current value to send to the newly joined socket
    });
    

    setSocket(s);

  }, [room]);

  

  function onChangeHandler(e) {
    setValue(e.target.value); 
    socket.emit('textarea', e.target.value)
  }

  return (
    <textarea onChange={onChangeHandler} value={value} />
  );
}

export default SharedTextarea;
