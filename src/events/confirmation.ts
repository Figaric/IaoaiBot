import { getConfirmationToken } from "src/modules/google/sheets";
import IEvent from "./IEvent";

export default {
    name: "confirmation",
    handle: async (res) => {
        res.status(200).send(await getConfirmationToken()).end();
    }
} as IEvent;