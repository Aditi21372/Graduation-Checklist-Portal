import { describe, expect, it } from "@jest/globals";
import request from "supertest";

// Integration test: needs a running, seeded MongoDB (MONGO_URL points at it).
// Skipped automatically elsewhere so the suite stays green without a database.
const itWithDb = process.env.MONGO_URL ? it : it.skip;

describe("API Tests", () => {
  itWithDb(
    "should respond",
    async () => {
      const { default: app } = await import("../server");
      const response = await request(app).get("/api/2019100/info");
      expect(response.body).toStrictEqual({
        branch: "July 2019/BTech/CSE",
        rollNumber: "2019100",
        studentName: " Satwik Tiwari",
      });
    },
    30_000
  );
});
