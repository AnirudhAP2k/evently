declare module "next-auth.types" {
    interface Session {
        id: string
    }

    interface JWT {
        id: string
    }
}