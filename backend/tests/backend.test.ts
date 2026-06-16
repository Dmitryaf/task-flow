import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import app from "../src/app";
import { resetTasksRepository } from "../src/repositories/taskRepository";
import { resetUsersRepository } from "../src/repositories/userRepository";

const password = "password123";

async function registerUser(email: string, name = "Test User") {
  const response = await request(app)
    .post("/api/auth/register")
    .send({ email, name, password });

  return {
    response,
    token: response.body.token as string,
  };
}

describe("auth API", () => {
  beforeEach(() => {
    resetTasksRepository();
    resetUsersRepository();
  });

  it("registers a user and returns public user data with a token", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "user@example.com",
      name: "User",
      password,
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user).toMatchObject({
      id: expect.any(Number),
      email: "user@example.com",
      name: "User",
    });
    expect(response.body.user.password).toBeUndefined();
  });

  it("rejects duplicate email registration", async () => {
    await registerUser("duplicate@example.com");

    const response = await request(app).post("/api/auth/register").send({
      email: "duplicate@example.com",
      name: "Another User",
      password,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "User already exists" });
  });

  it("logs in with valid credentials", async () => {
    await registerUser("login@example.com");

    const response = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password,
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user.email).toBe("login@example.com");
  });

  it("uses the same login error for unknown email and wrong password", async () => {
    await registerUser("known@example.com");

    const unknownEmailResponse = await request(app).post("/api/auth/login").send({
      email: "unknown@example.com",
      password,
    });
    const wrongPasswordResponse = await request(app).post("/api/auth/login").send({
      email: "known@example.com",
      password: "wrong-password",
    });

    expect(unknownEmailResponse.status).toBe(400);
    expect(wrongPasswordResponse.status).toBe(400);
    expect(unknownEmailResponse.body).toEqual({
      error: "Invalid password or email",
    });
    expect(wrongPasswordResponse.body).toEqual(unknownEmailResponse.body);
  });

  it("rejects invalid registration payload", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "not-an-email",
      name: "User",
      password: "123",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toEqual(expect.any(String));
  });
});

describe("tasks API", () => {
  beforeEach(() => {
    resetTasksRepository();
    resetUsersRepository();
  });

  it("rejects unauthenticated task list requests", async () => {
    const response = await request(app).get("/api/tasks");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Unauthorized" });
  });

  it("allows an authenticated user to create a task", async () => {
    const { token } = await registerUser("tasks@example.com");

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "First task" });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      title: "First task",
      status: "todo",
      userId: expect.any(Number),
      createdAt: expect.any(String),
    });
  });

  it("returns only tasks owned by the authenticated user", async () => {
    const firstUser = await registerUser("first@example.com");
    const secondUser = await registerUser("second@example.com");

    await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${firstUser.token}`)
      .send({ title: "First user task" });
    await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${secondUser.token}`)
      .send({ title: "Second user task" });

    const response = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${firstUser.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe("First user task");
  });

  it("prevents a user from updating another user's task", async () => {
    const owner = await registerUser("owner@example.com");
    const otherUser = await registerUser("other@example.com");
    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${owner.token}`)
      .send({ title: "Owner task" });

    const response = await request(app)
      .put(`/api/tasks/${createResponse.body.id}`)
      .set("Authorization", `Bearer ${otherUser.token}`)
      .send({ title: "Changed by other user" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Task not found" });
  });

  it("prevents a user from deleting another user's task", async () => {
    const owner = await registerUser("delete-owner@example.com");
    const otherUser = await registerUser("delete-other@example.com");
    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${owner.token}`)
      .send({ title: "Owner task" });

    const deleteResponse = await request(app)
      .delete(`/api/tasks/${createResponse.body.id}`)
      .set("Authorization", `Bearer ${otherUser.token}`);
    const ownerTasksResponse = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${owner.token}`);

    expect(deleteResponse.status).toBe(404);
    expect(deleteResponse.body).toEqual({ error: "Task not found" });
    expect(ownerTasksResponse.body).toHaveLength(1);
  });

  it("rejects empty task updates", async () => {
    const { token } = await registerUser("empty-update@example.com");
    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Task to update" });

    const response = await request(app)
      .put(`/api/tasks/${createResponse.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "At least one field is required",
    });
  });
});
