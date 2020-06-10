// command manager
// basically a name for a certain function to run via a string.


import * as net from "net";
import {createSocket} from "dgram";
import { master_server, sock, arg } from "./server";
import { queueManager} from "./queue";

interface command {
    name: string,
    command: any,
}


export class commandManager {
    static commands: command[] = [{name: "listConnections", command: function () {
        master_server.getConnections( function(error, count) {
            console.log("Connections: " + count);
            sock.write("Connections: " + count);
        });
        }},

        {name: "addQueue", command: function() {
            queueManager.pushToQueue(arg);
            sock.write("Added to queue.");
        }},

        {name: "listQueue", command: function() {
            sock.write(queueManager.getQueue().toString());
        }}];

    static getCommands() {
        return this.commands;
    }

    static getCommand(commandName: string) {
        const found = this.getCommands().find(obj => {return obj.name === commandName && obj.command})
        if(found) {
            console.log(`[Master] running ${found.name}..`)
            return found.command;
        } else {
            console.log("[Master] Command has not been found.");
            sock.write("Command has not been found.");
            return;
        }
    }

    static runCommand(commandName: string) {
        const command = this.getCommand(commandName);
        if(command == null) {
            return;
        }
        command();
    }

}