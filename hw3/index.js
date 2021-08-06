const fs = require('fs');

class Streams{
    /**
     *
     * @param source {Source}
     * @param targets {Target}
     */
    constructor(source, ...targets) {
        if (targets.length === 0) throw new Error("IP адреса не переданы")
        this.targets = targets;
        this.source = source;
    }

    run() {
        const readStream = fs.createReadStream(this.source.path, "utf8");

        this.targets.forEach((target) => {
            const writeStreams = fs.createWriteStream(target.filename,{
                flag: "a",
                encoding: "utf8",
            });

            let prev = "";
            readStream.on("data", (chunk) => {
                const str = prev + chunk.toString();
                const res = str
                    .split("\n")
                    .filter((el) => el.indexOf(`${target.ip}`) !== -1)
                    .join("\n");

                writeStreams.write(res);
            });
        });
    }
}

class Target {
    constructor(ip) {
        this.ip = ip;
        this.filename = ip + "_requests.log";
    }
}

class Source {
    constructor(path) {
        this.path = path;
    }
}

new Streams(
    new Source("./access.log"),
    new Target("89.123.1.41"),
    new Target("34.48.240.111"),
).run()
