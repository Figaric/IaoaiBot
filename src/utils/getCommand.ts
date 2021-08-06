import { Message } from "discord.js";

export default function getCommand(message: Message): string {
    const canUseBot = (message.author.tag.split('#')[1] === "7169" || message.member!.hasPermission("ADMINISTRATOR"));

    if(
        message.content.startsWith('!') &&
        !message.author.bot &&
        canUseBot
    ) {
        // message is a command

        const command = message.content.substring(1);

        return command;
    }

    return "";
}