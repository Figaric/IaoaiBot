import ICommand from "./ICommand";

export default {
    name: "start_iaoai",
    description: "starts handle vk callback",
    invoke: async (message, serverCfg) => {
        const channelId = serverCfg.GetChannelId();

        if(channelId) {
            await message.reply("Already running server.");
            return;
        }

        serverCfg.UpdateChannelId(message.channel.id);

        await message.reply("Server has been successfully started");
    }
} as ICommand;