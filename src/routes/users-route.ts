import { Elysia, t } from "elysia";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { registerUser } from "../services/user-service";

export const userRoutes = new Elysia({ prefix: "/api/users" })
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const { name, email, password } = body;
        const result = await registerUser(name, email, password);

        set.status = 201;
        return {
          data: result,
        };
      } catch (error: any) {
        if (error.message === "Email sudah terdaftar") {
          set.status = 400;
          return {
            error: "Email sudah terdaftar",
          };
        }

        set.status = 500;
        return {
          error: "Terjadi kesalahan server",
        };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 6 }),
      }),
    }
  )
  .get("/", async () => {
    try {
      const data = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          createdAt: users.createdAt,
        })
        .from(users);

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
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            createdAt: users.createdAt,
          })
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
