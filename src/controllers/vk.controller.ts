// import { DirectAuthorization, officialAppCredentials } from "@vk-io/authorization";
import { VK } from "vk-io";
import { GroupsGetResponse } from "vk-io/lib/api/schemas/responses";
import { Express, Response } from "express";
// import { Express } from "express";
// import http, { RequestListener } from "http";

type EventActionType = (res: Response, object?: any) => void;

type EventActionsType = { 
    confirmation: EventActionType
    board_post_new: EventActionType
}

export default class VkController {
    private vk: VK;
    private eventActions: EventActionsType;

    /**
     * Sets vk client up
     */
    public async SetUp() {

        this.vk = new VK({
            token: process.env.VK_TOKEN!
        });
    }

    public async SetUpEventActions(actions: EventActionsType) {
        this.eventActions = actions;
    }

    public async SetUpRoutes(app: Express) {
        app.post("/handle-new-post", (req, res) => {
            const { secret, group_id: groupId, type, object }: any = req.body;

            // Check for the secret
            if(!secret || secret !== process.env.CALLBACK_SECRET) {
                return res.json({ error: "Secret must be provided" });
            }

            // Check for the group id
            if(!groupId || groupId !== 206150335) {
                return res.json({ error: "Invalid group id" });
            }

            // Check if the available event types include the given one
            if(!Object.keys(this.eventActions).includes(type)) {
                return res.json({ error: "Unknown event type." });
            }

            (this.eventActions as Record<string, EventActionType>)[type](res, object);
            return;
        });
    }

    public async Test() {
        // const friends = await this.vk.api.friends.get({
        //     fields: ["about"]
        // });

        // return friends;

        const group: GroupsGetResponse = await this.vk.api.groups.get({
            extended: true
        });

        return group;
    }

}