const PORT = 3001;

const server = require('http').Server();
const socket = require('socket.io');
const io = socket(server, { transports: ['websocket'] });
const pty = require('node-pty');
let terminalPtys = {}; // {roomName: ptyProcess}

io.sockets.on('connection', socket => {

    socket.on('join-textarea', (room) => {
        socket.leaveAll();
        socket.join(room);
        console.log(socket.id, 'joining textarea room', room);

        socket.on('textarea', (value) => {
            socket.in(room).emit('textarea', value);
        });
    });

    socket.on('join-terminal', (room) => {
        if (!terminalPtys[room]) {
            const ptyProcess = pty.spawn(this.command, this.args || [], {
                name: 'xterm-color',
                // cols: 80,
                // rows: 20,
                // cwd: process.env.HOME,
                env: process.env
            });
            ptyProcess.onData((output) => {
                socket.in(room).emit('stdo', output);
            });
            terminalPtys[room] = ptyProcess;
        }
        else {
            terminalPtys[room].write('clear\n');
        }
        socket.leaveAll();
        socket.join(room);
        console.log(socket.id, 'joining terminal room', room);

        socket.on('stdin', (stdin) => {
            terminalPtys[room].write(stdin);
        })
    });

    socket.on('disconnect', async (reason) => {
        socket.leaveAll();
        socket.removeAllListeners();
        console.log(socket.id, 'leaving all rooms');
    })
});

server.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`);
});
