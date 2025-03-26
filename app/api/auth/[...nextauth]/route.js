import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/database";
import Users from "@/models/users";
import bcrypt from "bcrypt";

const authOption = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials;

        try {
          await connectDB();
          const user = await Users.findOne({ email });

          if (!user) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            return null;
          }

          // ต้อง return ออกมาให้มีฟิลด์ email (และอื่นๆ ที่ต้องการ)
          return {
            _id: user._id,
            email: user.email,
            role: user.role,
            name: user.firstName + " " + user.lastName, // สมมติ
            // หรือจะส่งกลับเป็น user._doc ทั้งหมดก็ได้ แต่ระวังข้อมูลเซนซิทีฟ
          };
        } catch (err) {
          console.log(err);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // อายุของเซสชัน 30 วัน
    updateAge: 24 * 60 * 60,   // อัปเดตทุก 24 ชั่วโมง
  },
  callbacks: {
    /**
     * jwt callback
     * เรียกใช้ทุกครั้งที่มีการสร้าง/อัปเดต token
     */
    async jwt({ token, user, account, profile }) {
      // กรณี user ล็อกอินครั้งแรก (หรือเพิ่ง authorize ใหม่)
      if (user) {
        token.id = user._id?.toString?.() || user.id;
        token.role = user.role || null;
        token.email = user.email || null; // เก็บ email ลงใน token
      }

      // ถ้าเป็น GoogleProvider
      if (account?.provider === "google" && profile?.email) {
        token.email = profile.email; // ดึง email จากโปรไฟล์ Google
      }

      return token;
    },

    /**
     * session callback
     * ใช้ผูกข้อมูลจาก token -> session
     */
    async session({ session, token }) {
      if (token) {
        session.user.idUser = token.id;
        session.user.role = token.role;
        // สำคัญ: เซต email ลงใน session.user
        session.user.email = token.email || null;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // ป้องกัน redirect loop ด้วยการควบคุม URL
      if (url.startsWith(baseUrl)) {
        return url;
      } else {
        return baseUrl;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login"
  }
};

const handler = NextAuth(authOption);
export { handler as GET, handler as POST };
