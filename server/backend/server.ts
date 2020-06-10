import * as net from "net";
import dotenv from "dotenv";
import {queueManager} from "./queue";
import {commandManager} from "./commands";

dotenv.config();


export let sock: net.Socket;
export let arg: string;

// MASTER TCP server that connects to the client to serve commands to the server.
export let master_server = net.createServer( function(socket) {

    sock = socket;

    console.log("[Master] Server online.")


    socket.on("connection", function(count) {
        console.log(`[Master][Connected] ${socket.remoteAddress}:${socket.remotePort}`);
    })

    socket.on("data", function(data) {
            const req = data.toString();
            if(req.startsWith("!")) {
                const cmd = req.substr(1);
                arg = req.substr(req.indexOf(' ')+1);
                commandManager.runCommand(cmd);
            } else {
                return;
            }
    })

    socket.on("close", function(socket) {
        console.log(`[Master][Disconnected]`);
    })

    socket.on("error", function(err) {
        console.log(`${socket.remoteAddress}:${socket.remotePort} caused an error: `)
        console.log(err.stack)
    })
}).listen(Number(process.env.MASTER_PORT), String(process.env.IP), Number(process.env.BACKLOG));



// SLAVE TCP server that connects to the application to send commands to the app.

export let slave_server = net.createServer( function(socket) {

    socket.on("close", function(socket) {
        console.log(`[Slave][Disconnected] Client disconnected.`);
    })

    console.log(`[Slave][Connected] ${socket.remoteAddress}:${socket.remotePort}`);
    console.log("[Slave] Getting array..");
    const array = queueManager.getQueue();
    console.log("[Slave] Sending array to client..");
    console.log(array);
    let i;
    for(i = 0; i < array.length; i++) {
        socket.write(array[i]);
        queueManager.shiftToQueue();
    }
    console.log("[Slave] Done.");
    return;


}).listen(Number(process.env.SLAVE_PORT), String(process.env.IP), Number(process.env.BACKLOG));