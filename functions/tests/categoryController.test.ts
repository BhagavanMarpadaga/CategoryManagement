import request from "supertest";
import { Server } from "http";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Catergoy from "../models/catergory";
import express from "express";
const app = express();

// Mock application setup

describe("POST /api/v1/category", () => {
  let server: Server;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Start MongoDB memory server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Connect to the test database
    await mongoose.connect(uri);

    // Start Express server
    server = app.listen(3000);
  });

  afterAll(async () => {
    // Clean up resources
    await mongoose.connection.close();
    await mongoServer.stop();
    server.close();
  });

  it("should create a root category successfully", async () => {
    const res = await request(server).post("/api/v1/category").send({
      categoryName: "Root Category",
      isRoot: true,
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Category added succcessfully");
    expect(res.body.data).toHaveProperty("_id");
    expect(res.body.data.isRoot).toBe(true);
  });

    it("should not allow creating more than one root category", async () => {
      // First root category creation
      await new Catergoy({ name: "Existing Root", isRoot: true }).save();

      const res = await request(server)
        .post("/api/v1/category")
        .send({
          categoryName: "Another Root",
          isRoot: true,
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("You are not allowed to create root");
    });

    it("should create a non-root category when parent exists", async () => {
      // Create a parent category
      const parentCategory = await new Catergoy({
        name: "Parent Category",
      }).save();

      const res = await request(server)
        .post("/api/v1/category")
        .send({
          categoryName: "Child Category",
          categoryParentId: (parentCategory._id as string).toString(),
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Category added succcessfully");
      expect(res.body.data).toHaveProperty("_id");
    });

    it("should return error if parent category does not exist", async () => {
      const invalidId = new mongoose.Types.ObjectId();

      const res = await request(server)
        .post("/api/v1/category")
        .send({
          categoryName: "Invalid Child",
          categoryParentId: invalidId.toString(),
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid Parent Category");
    });

    it("should handle validation errors for invalid input", async () => {
      const res = await request(server)
        .post("/api/v1/category")
        .send({
          categoryName: "", // Invalid data
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("categoryName is required");
    });
});
