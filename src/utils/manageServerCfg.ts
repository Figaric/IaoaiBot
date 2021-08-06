import fs from "fs";

export default class ServerCfgManager {
    private cached: {
        channelId: string
    }

    constructor() {
        this.cached = {
            channelId: ""
        }
    }

    public UpdateChannelId(channelId: string) {

        const obj = {
            channelId
        }

        fs.writeFile("./server_cfg.json", JSON.stringify(obj), (err) => {
            if(err) {
                return console.log("Could not update server config: ", err);
            }

            this.cached.channelId = channelId;
        });

    }

    public GetChannelId(): string {
        if(
            this.cached?.channelId
        ) {
            console.log("Using cached channel id");

            return this.cached.channelId;
        }

        let channelId = "";

        const fileData = fs.readFileSync("./server_cfg.json", "utf-8");

        try {
            channelId = JSON.parse(fileData).channelId;
        }
        catch(err) {
            console.log("Could not parse json: ", err);
        }

        this.cached.channelId = channelId;

        return channelId;
    }
}