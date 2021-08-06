import { Message } from "discord.js";
import ServerCfgManager from "../utils/manageServerCfg";

export default interface ICommand {
    name: string;
    description: string;
    invoke: (message: Message, serverCfg: ServerCfgManager) => void;
}