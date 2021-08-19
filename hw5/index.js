const http = require("http");
const { join } = require("path");
const fs = require('fs');
const io = require('socket.io');

const isFile = (path) => fs.lstatSync(path).isFile();
    const server  = http.createServer((req, res) => {
        const filePath = join(process.cwd(), req.url.replace(/\[\.\.]/gi, '..'));
        console.log('url '+req.url);
        console.log('filepath '+filePath);
        if(!fs.existsSync(filePath)){
            return res.end("file not found");
        };
        
        if(isFile(filePath)){
            return fs.createReadStream(filePath, "utf8").pipe(res);
        };

        const links = fs.readdirSync(filePath)
            .map(filename => [join(req.url, filename), filename])
            .map(([filepath, filename]) => `<li><a href="${filepath}">${isFile(join(filePath, filename))?'file ':'dir '}${filename}</a></li>`)
            .concat([
                `<li><a href="${req.url}${req.url=='/'?'[..]/':'/[..]'}">..</a></li>`
            ])
            .join("");

        const html = fs
            .readFileSync(join(__dirname, "index.html"), "utf8")
            .replace(/#links/gi, links);

        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end(html);
    });

    let clintCountOnlain = 0;
    const changeCount = (client, a) => {
        if(a<0)clintCountOnlain--;
        if(a>0)clintCountOnlain++;
        client.emit('CHANGE_CLIENT_COUNT', {msg: clintCountOnlain});
        client.broadcast.emit('CHANGE_CLIENT_COUNT', {msg: clintCountOnlain});
        console.log(clintCountOnlain);
    }
    const socket = io(server);
    socket.on('connection', (client) => {
        changeCount(client, +1)
      
        client.on('disconnect', () => {
            changeCount(client, -1)
        })
    });

    server.listen(3000);