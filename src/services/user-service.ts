import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<string> => {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser) {
    throw new Error("Email sudah terdaftar");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return "OK";
};
