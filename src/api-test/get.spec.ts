import { expect, test } from "@playwright/test";
import { ED__GET_POST, ED__GET_ALL_POST } from "../../fixtures/api/endpoints";
import { STATUS__200 } from "../../fixtures/api/statuses";

test("Get the first post", async ({ request, baseURL }) => {
    const _response = await request.get(`${baseURL}${ED__GET_POST}`);

    expect(_response.status()).toBe(STATUS__200);
    const res = await _response.json();
    console.log(res)
})

test("Get all post", async ({ request, baseURL }) => {
    const _response = await request.get(`${baseURL}${ED__GET_ALL_POST}`);

    expect(_response.status()).toBe(STATUS__200);
    const res = await _response.json();
    console.log(res)
})
