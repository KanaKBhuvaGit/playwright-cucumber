import { expect, test } from "@playwright/test";
import { HEADER__CONTENT_TYPE } from "../../fixtures/api/headers";
import { DATA__CREATE_POST, DATA__UPDATE_POST, DATA__UPDATE_TITLE } from "../../fixtures/api/testdata";
import { STATUS__200, STATUS__201, STATUS__404 } from "../../fixtures/api/statuses";

const POST_NUMBER = 1;
const END_POINT = "/posts/";

test("Create a post", async ({ request, baseURL }) => {
    const _response = await request.post(`${baseURL}${END_POINT}`, {
        data: DATA__CREATE_POST,
        headers: HEADER__CONTENT_TYPE
    });

    expect(_response.status()).toBe(STATUS__201);
    expect(_response.ok()).toBeTruthy();
    const res = await _response.json();
    // console.log(res);
})

test("Get the post", async ({ request, baseURL }) => {
    const _response = await request.get(`${baseURL}${END_POINT}${POST_NUMBER}`);

    expect(_response.status()).toBe(STATUS__200);
    const res = await _response.json();
    // console.log(res)
})

test("Upadate the title of the post", async ({ request, baseURL }) => {
    const _response = await request.patch(`${baseURL}${END_POINT}${POST_NUMBER}`, {
        data: DATA__UPDATE_TITLE,
        headers: HEADER__CONTENT_TYPE
    });
    // console.log(await _response.json());
    expect(_response.status()).toBe(STATUS__200);
    expect(_response.ok()).toBeTruthy();
})

test("Update the post", async ({ request, baseURL }) => {
    const _response = await request.put(`${baseURL}${END_POINT}${POST_NUMBER}`, {
        data: DATA__UPDATE_POST,
        headers: HEADER__CONTENT_TYPE
    });
    // console.log(await _response.json());
    expect(_response.status()).toBe(STATUS__200);
    expect(_response.ok()).toBeTruthy();
})

test("Delete the post", async ({ request, baseURL }) => {
    const _response = await request.delete(`${baseURL}/${END_POINT}${POST_NUMBER}`);

    // console.log(await _response.json());
    expect(_response.status()).toBe(STATUS__404);
})
