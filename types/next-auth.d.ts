// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      idUser: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;  // เพิ่ม role ที่นี่
    };
  }
}
