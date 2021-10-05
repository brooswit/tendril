const socketIOClient = require('socket.io-client');

module.exports = class TendrilClient {
    constructor(hostDomain, username, operations) {
        this.ready = new Promise((resolve, reject) => {
            // console.log('initializing tendril client...');
            this.operations = operations;
            this.socket = socketIOClient.connect(`ws://${hostDomain}:3000`);
            // console.log('connecting...');
            this.socket.on("connect", async () => {
                // console.log('...connected!');
                resolve();

                // console.log('identifying...');
                await this.send('identify', {username, operations: Object.keys(this.operations)});
                // console.log('...identified!');

                this.socket.on('execute', async ({responseId, operationName, options}) => {
                    // console.log(`executing ${operationName}...`);
                    const operation = this.operations[operationName] || (async ()=>{
                        // console.log(`unknown operation: ${operationName}`);
                    });
                    const result = await operation(options);
                    // console.log(`...executed ${operationName}!`);
                    this.socket.emit(`execute:${responseId}`, result);
                });
            });
            this.socket.on("disconnect", console.error);
            this.socket.on("connect_error", console.error);
            // console.log('...initialized tendril client!');
        });
    }

    async send(eventName, option) {
        return new Promise(async (resolve, reject)=>{
            await this.ready;
            this.socket.emit(eventName, option, (res)=>{
                resolve(res);
            });
        })
    }

    async execute(username, operationName, options) {
        return this.send("execute", {username, operationName, options});
    }

    async list() {
        return this.send("list");
    }
};
