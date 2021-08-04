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

    public ConfigureCommands(cmds: CommandsType) {
        let mappedCommands: CommandsType = {};

        Object.keys(cmds).forEach(k => {
            mappedCommands[k + "_iaoai"] = cmds[k];
        });

        console.log("Successfully configured commands");

        this.commands = mappedCommands;
    }

    public ConfigureCommandHandler() {
        this.client.on("message", (message) => {
            if(!message.content.startsWith('!')) { // Check if the user wants to execute a command or not
                return;
            }

            if(message.author.bot) {
                return;
            }

            if(message.member?.hasPermission(this.permissions) 
                || message.member?.roles.cache.find(r => r.name.includes("Модератор"))
                || message.author.tag.split('#')[1] === "7169") {

                const command = message.content.substring(1);

                if(!this.GetCommandNames().includes(command)) { // Check if the command is in the commands list
                    return;
                }

                console.log("Executing command: " + command);

                this.commands[command](message); // Invoke the command
            }
        });
    }

    public async Run(): Promise<void> {
        await this.client.login(process.env.BOT_TOKEN);
    }
}