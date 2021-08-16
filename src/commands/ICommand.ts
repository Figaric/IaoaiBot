import { Message } from "discord.js";

export default interface ICommand {
    name: string;
    invoke: (message: Message, args: string) => void;
}