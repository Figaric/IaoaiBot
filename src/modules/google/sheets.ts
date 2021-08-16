import { google } from "googleapis";
import { getGoogleClient } from "./auth";

const cached = {
    channelId: "",
    confirmationToken: "",
    callbackSecret: ""
}

async function fetchSheets(range: string) {
    const auth = await getGoogleClient();

    const sheets = google.sheets({ version: "v4", auth });
    const realRange = `Sheet1!${range}`;

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.IaoaiBotSheetId,
        range: realRange
    })

    return response.data.values!;
}

export async function getChannelId(): Promise<string> {
    if(cached.channelId) {
        console.log("Using cached channel id");

        return cached.channelId;
    }

    const [[channelId]] = await fetchSheets("A1");

    cached.channelId = channelId;

    return channelId;
}

export async function getConfirmationToken() {
    if(cached.confirmationToken) {
        return cached.confirmationToken;
    }

    const [[confirmationToken]] = await fetchSheets("A2");

    cached.confirmationToken = confirmationToken;

    return confirmationToken;
}

export async function getCallbackSecret() {
    if(cached.callbackSecret) {
        return cached.callbackSecret;
    }

    const [[callbackSecret]] = await fetchSheets("A3");

    cached.callbackSecret = callbackSecret;

    return callbackSecret;
}