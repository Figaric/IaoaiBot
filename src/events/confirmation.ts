import IEvent from "./IEvent";

export default {
    name: "wall_post_new",
    handle: (res) => {
        res.status(200).send(process.env.CONFIRMATION_TOKEN).end();
    }
} as IEvent;