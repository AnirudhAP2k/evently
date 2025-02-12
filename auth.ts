import NextAuth, { CredentialsSignin } from "next-auth";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { LoginSchema } from "@/lib/validation";


export const { handlers, auth, signIn, signOut }  = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.GOOGLE_ID || "",
            clientSecret: process.env.GOOGLE_SECRET || "",
        }),
        GitHub({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials: any) {
                const validated = LoginSchema.safeParse(credentials);

                if (!validated.success) {
                    throw new Error("Invalid Credentials");
                }

                const { email, password } = validated.data;

                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user || !user.password) {
                    throw new Error("User not found");
                }
                
                const isValid = user.password && (await bcrypt.compare(password, user.password));

                if (!isValid) {
                    throw new Error("Invalid Password");
                }

                return user;
            }
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async session({ session, token }: { session: any; token: any }) {
            if (session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }: { token: any; user: any }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },
});
