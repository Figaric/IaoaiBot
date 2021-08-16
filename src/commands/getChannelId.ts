import { getChannelId } from "../modules/google/sheets";
import ICommand from "./ICommand";

export default {
    name: "getChannelId_iaoai",
    invoke: async (message) => {
        console.log("Current channel id: " + (await getChannelId()));
        
        await message.channel.messages.delete(message);
    }
} as ICommand;