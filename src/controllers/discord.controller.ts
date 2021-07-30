import { Client, Message, PermissionResolvable } from "discord.js";

type CommandsType = Record<string, (message: Message) => void>

export default class DiscordController {
    private commands: CommandsType;
    private client: Client;
    private permissions: PermissionResolvable;
    
    constructor () {
        this.client = new Client();
        this.permissions = ["ADMINISTRATOR"];
    }

    private GetCommandNames() {
        return Object.keys(this.commands);
    }

    public SetUpCommands(cmds: CommandsType) {
        let mappedCommands: CommandsType = {};

        Object.keys(cmds).forEach(k => {
            mappedCommands[k + "_iaoai"] = cmds[k];
        });

        this.commands = mappedCommands;

        // console.log("commands: ", this.commands);
        // console.log("cmds: ", mappedCommands);
    }

    public SetUpListeners() {
        this.client.on("message", (message) => {
            if(!message.content.startsWith('!')) { // Check if the user wants to execute a command or not
                return;
            }

            if(message.author.bot) {
                return;
            }

            if(!message.member?.hasPermission(this.permissions)) { // Is the user allowed to use this bot
                return;
            }

            const command = message.content.substring(1);

            if(!this.GetCommandNames().includes(command)) { // Check if the command is in the commands list
                return;
            }

            this.commands[command](message); // Invoke the command
        });
    }

    public async Run(): Promise<void> {
        await this.client.login(process.env.BOT_TOKEN);
    }
}