import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "../../../lib/db"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  adapter: MongoDBAdapter(client),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt',
  },
  // this call back returns the id of the user which will be used to associate the user with the posts and other stuff
  callbacks: {
    session: async ({token, session}) => {
      // if session exists already
      if(session?.user && token?.sub){
        session.user.id = token.sub;
      }
      // if no session present, just return the session after creaing it
      return session;
    }
  }
}

export default NextAuth(authOptions)