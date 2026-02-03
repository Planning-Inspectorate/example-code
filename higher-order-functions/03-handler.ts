import http from 'http';
import type {IncomingMessage, ServerResponse} from 'http';

// a common use case for higher-order functions is handlers for use with HTTP server
// or express route handling
// here we pass in some dependency, in this case a logger
// and return a handler for use with createServer
function buildHttpHandler(logger: typeof console) {
    return (req: typeof IncomingMessage, res: typeof ServerResponse) => {
        logger.log(req.method, req.url);
        res.writeHead(200);
        res.end('Hello, World!');
    };
}

// we create our handler by passing in any dependencies
const myHandler = buildHttpHandler(console);
// we pass our handler for the server to call when requests come in
const server = http.createServer(myHandler);

server.listen(3000);
server.on('listening', () => {
    console.log('server started on http://localhost:3000');
});