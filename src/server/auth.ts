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
import { STATUS } from "../../constants";

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
      status: Record<keyof typeof STATUS, boolean>
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
  // interface User extends InstanceType<typeof prisma.Prom> {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    status?: number
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/signIn",
    error: "/auth/error"
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60
  },
  callbacks: {
    async session({ session, user, token }) {
      if (session.user && user) {
        session.user.id = user?.id;
        // session.user.role = user.role; <-- put other properties on the session here
      } else if (token.sub) {
        /**
         * All providers will come trhough here as we have enabled the session stategy to be JWT
        **/
        session.user.id = token.sub
        // session.user.role = token.sub; <-- decode role from token here
      } else {
        throw new Error(JSON.stringify('No user nor token present!!!'))
      }
      return session;
    },
    async jwt({token, user}) {
      // TODO:
      if (user) {
        const emailVerifiedDate = await prisma.user.findFirst({
          where: {
            email: user.email
          }
        }).then(x => x?.emailVerified ?? 0);

        let status: number = 0;
        token.status = status
      }
      return token
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      id: 'github',
      name: "GitHub",
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
      id: 'credentials',
      type: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {}, password: {}
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined, req: any) {
        const formErrors = validateLoginForm(
          {email: credentials?.email, password: credentials?.password}
        )

        try {
          if (Object.keys(formErrors).length) {
            throw new AuthError(JSON.stringify(formErrors))
          }
          const { email, password } = credentials as {
            email: string,
            password: string
          };
          const user = await prisma.user.findFirst({
            where: {
              email: email
            }
          });

          if (!user) {
            formErrors.email = 'EMAIL_DOESNT_EXIST'
            throw new AuthError(JSON.stringify(formErrors))
          }
          if (user.password && !await bcrypt.compare(password, user.password)) {
            formErrors.password = 'INCORRECT_PASSWORD'
            throw new AuthError(JSON.stringify(formErrors))
          }

          return user;
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
