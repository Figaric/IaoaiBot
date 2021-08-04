import dotenv from "dotenv";
dotenv.config();

import DiscordController from "./controllers/discord.controller";
import ExpressController from "./controllers/express.controller";

const main = async () => {
    const discord = new DiscordController();
    const expController = new ExpressController();

    discord.ConfigureCommands({
        ping: async (message) => {
            await message.reply("pong");
        },
        start: async (message) => {
            expController.ConfigureCallbackEvents();
            expController.ConfigureCallbackHandler(message);
            
            await expController.RunHandler(message);
        },
        stop: async (message) => {
            await expController.StopHandler(message);
        }
    });
    discord.ConfigureCommandHandler();

    await discord.Run();

    console.log("Bot started");
}

main().catch(console.error);