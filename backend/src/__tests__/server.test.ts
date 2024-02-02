import { describe, expect, test } from "@jest/globals";
import app from "../server";
import request from "supertest";

describe("API Tests", () => {
  it("should respond", async () => {
    const response = await request(app).get("/api/2019100/info");
    expect(response.body).toStrictEqual({
      branch: "July 2019/BTech/CSE",
      rollNumber: "2019100",
      studentName: " Satwik Tiwari",
    });
  });
});
