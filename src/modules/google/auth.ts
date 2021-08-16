import { google } from "googleapis";

const cached = {
    auth: undefined
}

export async function getGoogleClient() {
    if(cached.auth) {
        console.log("Using cached google client");

        return cached.auth;
    }

    return google.auth.getClient({ scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"] });
}