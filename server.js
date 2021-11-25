const net = require('net');
const fs = require('fs');

const server = net.createServer(socket=>{
    socket.on("data",buffer=>{
        const requestMessage = buffer.toString();
        const [first] = requestMessage.split('\r\n');
        let [method, resource, version] = first.split(' ');

        if(resource[resource.length - 1] === "/"){
            resource += "index.html";
        }

        if(fs.existsSync("./source"+resource)){
            const content = fs.readFileSync("./source"+resource);
            console.log(content.toString());
        }

        socket.write("HTTP/1.1 200 OK");

    })
});

server.listen(4000);