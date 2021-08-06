import ICommand from "./ICommand";

export default {
    name: "stop_iaoai",
    description: "stops handling vk callback",
    invoke: async (message, serverCfg) => {
        if(!serverCfg.GetChannelId()) {
            await message.reply("Server is already stopped.");
            return;
        }

        serverCfg.UpdateChannelId("");

        await message.reply("Server has been successfully stopped");
    }
} as ICommand;