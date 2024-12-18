import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from "@/lib/database";
import Users from "@/models/users";
import bcrypt from 'bcrypt'
import GoogleProvider from "next-auth/providers/google";

const authOption = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        
        CredentialsProvider({
            name: 'credentials',
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

                    return user;

                } catch (err) {
                    console.log(err)
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
        async jwt({ token, user }) {
            if (user) {
                token.id = user._id.toString(); 
                token.role = user.role; 
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.idUser = token.id; 
                session.user.role = token.role
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
    page: {
        signIn: "/Login"
    }
}

const handler = NextAuth(authOption);
export { handler as GET, handler as POST };