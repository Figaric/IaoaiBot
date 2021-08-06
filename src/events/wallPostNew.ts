import IEvent from "./IEvent";

export default {
    name: "wall_post_new",
    handle: async (res, serverCfg, { attachments }, discord) => {
        const channelId = serverCfg.GetChannelId();

        if(!channelId) {
            res.status(400).send("Server is not started").end();
            return;
        }

        // Not a meme
        if(attachments.length !== 1) {
            return res.status(200).send("ok").end();
        }
    
        const attachedVideo = attachments[0].video;
        const videoUrl = `https://vk.com/club${Math.abs(attachedVideo.owner_id)}?z=video${attachedVideo.owner_id}_${attachedVideo.id}%2F${attachedVideo.access_key}%2Fpl_wall_${attachedVideo.owner_id}`;
        const videoImage = attachedVideo.image.find((i: any) => i.height === 450)!.url;
        
        const channel = discord.channels.cache.get(channelId) as any;

        channel.send(`${attachedVideo.title}\n${videoImage}\n${videoUrl}`);

        console.log("Successfully handled new meme");

        return res.status(200).send("ok").end();
    }
} as IEvent;