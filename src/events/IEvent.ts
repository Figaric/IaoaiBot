import { Client } from "discord.js";
import { Response } from "express";

export default interface IEvent {
    name: string,
    handle: (res: Response, post: any, discord: Client) => void;
}