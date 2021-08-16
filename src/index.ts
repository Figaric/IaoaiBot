import dotenv from "dotenv";
dotenv.config();

import { Client } from "discord.js";
import ICommand from "./commands/ICommand";
import getCommand from "./utils/getCommand";
import express from "express";
import IEvent from "./events/IEvent";
import wallPostNew from "./events/wallPostNew";
import confirmation from "./events/confirmation";
import getChannelId from "./commands/getChannelId";
import { getGoogleClient } from "./modules/google/auth";

async function main() {
    getGoogleClient();

    const app = express();
    const discord = new Client();
    
    const commands: ICommand[] = [getChannelId];
    const events: IEvent[] = [wallPostNew, confirmation];
    
    const port = process.env.PORT || 8080;

    app.use(express.json());

    //#region Configure express endpoints

    app.get("/", (_, res) => {
        res.send("Iaoai bot homepage.");
    });

    app.post("/handle-new-post", (req, res) => {
        const { type, object: post, secret } = req.body;

        console.log("New request: ", type);

        if(!secret || secret !== process.env.CALLBACK_SECRET) {
            return res.status(400).send("Invalid secret").end();
        }

        const event = events.find(e => e.name === type);

        if(!type || !event) {
            return res.status(400).send("Unknown event type").end();
        }

        try {
            event.handle(res, post, discord);
        } catch(err) {
            console.log("Could not handle event: ", err);

            return res.status(400).send("Could not handle event").end();
        }
    });

    //#endregion

    //#region Handle discord message

    discord.on("message", async (message) => {

        const commandName = getCommand(message);
        if(!commandName) return; // if commandName equals "", return, otherwise continue

        const command = commands.find(c => c.name === commandName); // try to get command from the commands list
        if(!command) return;

        const args = message.content.split(' ')[1];

        try {
            command.invoke(message, args);
        } catch(error) {

            console.error("error: ", error);

            await message.reply("Something went wrong");
            return;
        }
    });

    //#endregion

    //#region Start

    discord.once("ready", () => {
        console.log("Bot is run!");

        app.listen(port, () => console.log("Started server on port " + port));
    });

    await discord.login(process.env.BOT_TOKEN);

    //#endregion
}

main().catch(console.error);