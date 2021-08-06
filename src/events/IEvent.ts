import { Client } from "discord.js";
import { Response } from "express";
import ServerCfgManager from "src/utils/manageServerCfg";

export default interface IEvent {
    name: string,
    handle: (res: Response, serverCfg: ServerCfgManager, post: any, discord: Client) => void;
}