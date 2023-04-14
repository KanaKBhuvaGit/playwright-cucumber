import { expect, test } from "@playwright/test";
import { ED__UPDATE_POST } from "../../fixtures/api/endpoints";
import { HEADER__CONTENT_TYPE } from "../../fixtures/api/headers";
import { DATA__UPDATE_POST } from "../../fixtures/api/testdata";
import { STATUS__200 } from "../../fixtures/api/statuses";

// Uppdate
test("Update the post", async ({ request, baseURL }) => {
    const _response = await request.put(`${baseURL}${ED__UPDATE_POST}`, {
        data: DATA__UPDATE_POST,
        headers: HEADER__CONTENT_TYPE
    });
    // console.log(await _response.json());
    expect(_response.status()).toBe(STATUS__200);
    expect(_response.ok()).toBeTruthy();
})
