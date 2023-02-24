import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import bcrypt from 'bcrypt';
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { validateLoginForm } from "services/validation/validateForm";

const AuthError = class AuthError extends Error {}

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
    CredentialsProvider({
      id: 'login',
      credentials: {
        username: {}, password: {}
      },
      async authorize(form = {} as any) {
        const formErrors = validateLoginForm(form)
        const { username: name, password } = form
        try {
          if (Object.keys(formErrors).length) {
            throw new AuthError(JSON.stringify(formErrors))
          }
          const user = await prisma.user.findFirst({
            where: {
              name: name
            }
          });
          if (!user) {
            formErrors.username = 'INCORRECT_USERNAME'
            throw new AuthError(JSON.stringify(formErrors))
          }
          if (!await bcrypt.compare(password, user.password)) {
            formErrors.password = 'INCORRECT_PASSWORD'
            throw new AuthError(JSON.stringify(formErrors))
          }
          return user
        } catch(err) {
          if (err instanceof AuthError) throw err
          console.error(err)
          formErrors.form = 'SOMETHING_WENT_WRONG'
          throw new Error(JSON.stringify(formErrors))
        }
      }
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
