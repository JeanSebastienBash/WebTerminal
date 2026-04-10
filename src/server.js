require('dotenv').config();

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const pty = require('node-pty');
const path = require('path');
const os = require('os');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;
const FAKE_USERNAME = process.env.FAKE_USERNAME || 'dev';
const FAKE_HOSTNAME = process.env.FAKE_HOSTNAME || 'workstation';

app.use(express.static(path.join(__dirname, '..', 'public')));

wss.on('connection', (ws) => {
    console.log('[WS] New connection');

    const homeDir = os.homedir();
    const ptyProcess = pty.spawn('bash', ['-i'], {
        name: 'xterm-256color',
        cols: 80,
        rows: 24,
        cwd: homeDir,
        env: Object.assign({}, process.env, {
            TERM: 'xterm-256color',
            HOME: homeDir,
            USER: FAKE_USERNAME,
            LOGNAME: FAKE_USERNAME
        })
    });

    console.log('[PTY] Spawned PID:', ptyProcess.pid);

    ptyProcess.onData((data) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(data);
        }
    });

    ptyProcess.onExit(({ exitCode }) => {
        console.log('[PTY] Exit code:', exitCode);
        ws.close();
    });

    ws.on('message', (raw) => {
        try {
            const msg = JSON.parse(raw);
            if (msg.type === 'input') {
                ptyProcess.write(msg.data);
            } else if (msg.type === 'resize') {
                try { ptyProcess.resize(msg.cols, msg.rows); } catch (e) {}
            }
        } catch (e) {
            ptyProcess.write(raw);
        }
    });

    ws.on('close', () => {
        console.log('[WS] Connection closed');
        try { ptyProcess.kill(); } catch (e) {}
    });

    setTimeout(() => {
        const cmd = [
            'if [ -f ~/.bashrc ]; then source ~/.bashrc; fi',
            'if [ -f ~/.bash_profile ]; then source ~/.bash_profile; fi',
            'if [ -f ~/.bash_aliases ]; then source ~/.bash_aliases; fi',
            "export PS1='\\[\\e[1;32m\\]" + FAKE_USERNAME + "@" + FAKE_HOSTNAME + "\\[\\e[0m\\]:\\[\\e[1;34m\\]\\w\\[\\e[0m\\]\\$ '",
            'export USER=' + FAKE_USERNAME,
            'export LOGNAME=' + FAKE_USERNAME,
            'export HOSTNAME=' + FAKE_HOSTNAME,
            'clear'
        ].join('; ');
        ptyProcess.write(cmd + '\n');
    }, 200);
});

server.listen(PORT, () => {
    console.log('Ghost Terminal running on http://localhost:' + PORT);
    console.log('Masked identity: ' + FAKE_USERNAME + '@' + FAKE_HOSTNAME);
});
