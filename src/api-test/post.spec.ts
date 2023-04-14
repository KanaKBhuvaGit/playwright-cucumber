import { expect, test } from "@playwright/test";
import { ED__CREATE_POST } from "../../fixtures/api/endpoints";
import { HEADER__CONTENT_TYPE } from "../../fixtures/api/headers";
import { DATA__CREATE_POST } from "../../fixtures/api/testdata";
import { STATUS__201 } from "../../fixtures/api/statuses";

// Create
test("Create a post", async ({ request, baseURL }) => {
    const _response = await request.post(`${baseURL}${ED__CREATE_POST}`, {
        data: DATA__CREATE_POST,
        headers: HEADER__CONTENT_TYPE
    });

    expect(_response.status()).toBe(STATUS__201);
    expect(_response.ok()).toBeTruthy();
    const res = await _response.json();
    // console.log(res);
})
