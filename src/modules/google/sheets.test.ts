import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

import { BaseExternalAccountClient, Compute, JWT, UserRefreshClient, Impersonated } from "google-auth-library";
import { google } from "googleapis";

describe("Working with Google Sheets", () => {

    let auth: BaseExternalAccountClient | Compute | JWT | UserRefreshClient | Impersonated;

    beforeAll(async () => {

        auth = await google.auth.getClient({ scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"] });
    });

    it("authorizes to the service account", () => {
        expect(auth).toBeDefined();
    });

    it("fetches data from google sheets", async () => {
        const sheets = google.sheets({ version: "v4", auth });
        const range = "Sheet1!A1:A2";

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.IaoaiBotSheetId,
            range
        });

        const [[data1], [data2]] = response.data.values!;

        expect(data1).toBe("here_is_a_bit_of_data_for_you");
        expect(data2).toBe("some_other_data_bro");
    });
});