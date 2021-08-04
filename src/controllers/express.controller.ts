import { Message } from "discord.js";
import express, { Express, Response } from "express";
import { Server } from "http";
import { VK } from "vk-io";

export default class ExpressController {
    private app: Express;
    private server: Server;
    private groupId: number;
    private events: Record<string, (res: Response, post: any, message: Message) => void>;
    private vk: VK;
    private port;

    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.port = process.env.PORT || 8080;
        this.vk = new VK({
            token: process.env.VK_TOKEN!
        });
        this.groupId = 197605839;
    }

    public async RunHandler(message: Message) {
        if(this.server?.listening) {
            return await message.reply("Bot is already running");
        }

        await message.reply("Running bot...");

        this.server = this.app.listen(this.port);

        return await message.reply("Bot has been successfully run");
    }

    public async StopHandler(message: Message) {
        if(!this.server?.listening) {
            return await message.reply("Bot is already stopped");
        }

        await message.reply("Stopping bot");

        this.server.close();

        console.log("Successfully stopped bot.");
        return await message.reply("Bot has been successfully stopped");
    }

    public ConfigureCallbackEvents() {
        this.events = {
            confirmation: (res) => res.status(200).send(process.env.CONFIRMATION_TOKEN).end(),

            wall_post_new: async (res, post, message) => {
                if(post?.attachments?.length !== 1) {
                    return this.HandlerSmthWentWrong(res, "Not a meme.");
                }

                const attachedVideo = post.attachments[0].video;
                const video = await this.vk.api.video.get({
                    videos: `${attachedVideo.owner_id}_${attachedVideo.id}`,
                    extended: true,
                    count: 2
                });

                const image = (attachedVideo.image as { height: number, url: string }[]).find(i => i.height === 450)!.url;

                const videoGroupSceenName = video.groups![0].screen_name;
                const videoOwnerId = video.items[0].owner_id;
                const videoUrl = `https://vk.com/${videoGroupSceenName}?z=video${videoOwnerId}_${video.items[0].id}%2F${attachedVideo.access_key}%2Fpl_wall_${videoOwnerId}`;

                await message.channel.send(attachedVideo.title);
                await message.channel.send(image);
                await message.channel.send(videoUrl);

                console.log("Post has been successfully handled");

                return res.status(200).send("ok").end();
            }
        }
    }

    public ConfigureCallbackHandler(message: Message) {
        this.app.get("/", (_, res) => {
            res.send("Hello World!");
        });

        this.app.post("/handle-new-post", (req, res) => {
            console.log("New request");

            const { object: post, secret, group_id: groupId, type }: any = req.body || {};

            if(!secret || secret !== process.env.CALLBACK_SECRET) {
                console.log("Invalid secret");
                return this.HandlerSmthWentWrong(res, "Invalid secret");
            }

            if(!groupId || groupId !== this.groupId) {
                console.log("Invalid group id");
                return this.HandlerSmthWentWrong(res, "Invalid group id");
            }

            if(!Object.keys(this.events).includes(type)) {
                console.log("Unknown event type: " + type);
                return this.HandlerSmthWentWrong(res, "Unknown event type");
            }

            try {
                this.events[type](res, post, message); // Handle event
            } catch(err) {
                console.log("Something went wrong: " + err?.message);

                return res.status(200).send("ok").end();
            }
        });
    }

    private HandlerSmthWentWrong(res: Response, error: string) {
        return res.status(400).send(error).end();
    }

}