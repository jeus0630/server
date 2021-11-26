const net = require('net');
const fs = require('fs');
const mimeTypes = require('mime-types');

const server = net.createServer(socket=>{
    socket.on("data",buffer=>{
        const reqMessage = buffer.toString();
        const reqMessageLines = reqMessage.split('\r\n');
        const [firstLine] = reqMessageLines
        let [method, resource, version] = firstLine.split(' ');

        const requestHeaders = {};

        for(let i = 1; reqMessageLines[i] !== ''; i++){
            const [key,value] = reqMessageLines[i].split(': ');
            requestHeaders[key] = value;
        }

        if(resource[resource.length - 1] === "/"){
            resource += "index.html";
        }

        if(fs.existsSync("./source"+resource)){
            const content = fs.readFileSync("./source"+resource);
            socket.write(Buffer.from("HTTP/1.1 200 OK\r\n"));
            socket.write(Buffer.from(`Content-Type: ${mimeTypes.lookup('./source/'+resource)}\r\n`));
            socket.write(Buffer.from(`Content-Length: ${content.length}\r\n`));
            socket.write(Buffer.from("\r\n"));
            socket.write(content);
            socket.write(Buffer.from("\r\n"));
            return;
        }

        const content = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>Document</title></head><body>
                            <h1>NOT FOUND</h1></body></html>`;

        socket.write(Buffer.from("HTTP/1.1 404 Not Found\r\n"));
        socket.write(Buffer.from("Content-Type: text/html\r\n"));
        socket.write(Buffer.from(`Content-Type: ${mimeTypes.lookup('./source/'+resource)}\r\n`));
        socket.write(Buffer.from("\r\n"));
        socket.write(content);
        socket.write(Buffer.from("\r\n"));
    })

});

server.listen(4000);