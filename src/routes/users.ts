import { Elysia, t } from "elysia";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export const userRoutes = new Elysia({ prefix: "/users" })
  .get("/", async () => {
    try {
      const data = await db.select().from(users);
      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to fetch users",
        error: error.message,
      };
    }
  })
  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      try {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, Number(id)));

        if (!user) {
          set.status = 404;
          return { success: false, message: "User not found" };
        }

        return { success: true, data: user };
      } catch (error: any) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to fetch user",
          error: error.message,
        };
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const { name, email } = body;
        await db.insert(users).values({ name, email });

        set.status = 201;
        return {
          success: true,
          message: "User created successfully",
        };
      } catch (error: any) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to create user",
          error: error.message,
        };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String({ format: "email" }),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params: { id }, body, set }) => {
      try {
        const { name, email } = body;
        await db
          .update(users)
          .set({ name, email })
          .where(eq(users.id, Number(id)));

        return {
          success: true,
          message: "User updated successfully",
        };
      } catch (error: any) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to update user",
          error: error.message,
        };
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Object({
        name: t.Optional(t.String()),
        email: t.Optional(t.String({ format: "email" })),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params: { id }, set }) => {
      try {
        await db.delete(users).where(eq(users.id, Number(id)));
        return {
          success: true,
          message: "User deleted successfully",
        };
      } catch (error: any) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to delete user",
          error: error.message,
        };
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  );
