import { describe, expect, test } from "@jest/globals";
import { sum } from "../server";
import app from "../server";
import request from "supertest";

describe("sum module", () => {
    test("adds 1 + 2 to equal 3", async () => {
        await expect(sum(1, 2)).toBe(3);
    });
});

describe("API Tests", () => {
    it("should respond", async () => {
        const response = await request(app).get("/api/2019100/info");
        expect(response.body).toStrictEqual({"branch": "July 2019/BTech/CSE","rollNumber":"2019100","studentName":" Satwik Tiwari"});
    });
});
