import dotenv from "dotenv";
dotenv.config();

import express, { Express, Response } from "express";
import { Server } from "http";
import DiscordController from "./controllers/discord.controller";
import VkController from "./controllers/vk.controller";

const main = async () => {
    const discord = new DiscordController();
    let app: Express;
    let server: Server;
    let vk: VkController;

    discord.SetUpCommands({
        start: async (message) => {
            // Check if the server is already running
            if(server?.listening) {
                await message.reply("Vk controller is already running.");
                return;
            }

            await message.reply("Starting vk controller...");

            try {

                vk = new VkController();
                app = express();

                app.set("PORT", process.env.PORT || 8080);
                app.use(express.json());

                app.get("/", (_, res) => {
                    return res.send("Hello World!");
                });

                vk.SetUp();
                vk.SetUpEventActions({
                    confirmation: (res: Response) => {
                        return res.send("186fe5ac");
                    },
                    wall_post_new: async (_, object) => {
                        await message.channel.send(object.attachments);
                        await message.channel.send(object.text);
                    }
                });

                /*
                    Configures express routes
                    In our case - vk callback api handler
                */
                vk.SetUpRoutes(app);

                server = app.listen(app.get("PORT"), () => {
                    console.log("Started server on localhost:" + app.get("PORT"));
                });

            } catch(err) {
                console.error(err);
                await message.reply("Somthing went wrong");
                return;
            }

            console.log("Vk controller is run");
            await message.reply("Vk controller has been successfully configured!");
        },
        stop: async (message) => {
            // Check if the server is already stopped
            if(!server?.listening) {
                await message.reply("Server is already stopped.");
            }

            await message.reply("Stopping server...");

            server.close();

            console.log("Server has been stopped");
            await message.reply("Server has been successfully stopped!");
        }
    });
    discord.SetUpListeners();

    await discord.Run();

    console.log("Bot started");
}

main().catch(console.error);