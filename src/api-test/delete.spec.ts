import { expect, test } from "@playwright/test";
import { ED__DELETE__POST } from "../../fixtures/api/endpoints";
import { STATUS__404 } from "../../fixtures/api/statuses";

// Delete
test("Delete the first post", async ({ request, baseURL }) => {
    const _response = await request.delete(`${baseURL}/${ED__DELETE__POST}`);

    console.log(await _response.json());
    expect(_response.status()).toBe(STATUS__404);
})
