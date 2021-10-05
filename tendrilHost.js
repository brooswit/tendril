const http = require("http");
const socketIO = require("socket.io");

module.exports = class TendrilHost {
    constructor() {
        this.usernames = [];

        this.server = http.createServer();
        this.socketHost = socketIO(this.server);
        this.nextResponseId = 0;
        
        this.socketHost.on("connection", (socket) => {
            let socketData = {};
            // console.log("connection!")
            socket.on('identify', async (data, cb) => {
                // console.log('identifying...')
                let {username, operations} = data;
                // console.log("setting username: " + username);
                socketData.username = username;
                this.usernames[username] && this.usernames[username].socket.emit('demote');
                this.usernames[username] = {socket, operations};
                cb();
            });
            socket.on('execute', async ({username, operationName, options}, handleResponse) => {
                // console.log(socketData.username + ' requested that ' + username + ' executes operation ' + operationName)
                this.nextResponseId ++;
                const responseId = this.nextResponseId;
                if (!this.usernames[username]) {
                    handleResponse(undefined);
                } else {
                    socket.once(`execute:${responseId}`, handleResponse);
                    this.usernames[username].socket.emit('execute', {responseId, operationName, options}, (_, cb)=>{cb();});
                }
            });
            socket.on('list', async (_, cb) => {
                // console.log('listing');
                let response = {};
                for (let userName in this.usernames) {
                    let user = this.usernames[userName];
                    response[userName] = user.operations;
                }
                // console.log(response);
                cb(response);
            });
        });

        this.server.listen(3000);
        // console.log("listening...")
    }
};
