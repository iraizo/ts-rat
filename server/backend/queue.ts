// queue handler
// adds/removes/gets commands from an array


export class queueManager {
    static queue: string[] = ["echo success running cmd command from middleman TCP server.", "echo TypeScript FTW"];

    static getQueue() {
        return this.queue;
    }

    static pushToQueue(item: string) {
        this.queue.push(item);
    }

    static shiftToQueue() {
        this.queue.shift();
    }

};


