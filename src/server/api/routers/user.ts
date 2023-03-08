import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import bcrypt from 'bcrypt';

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string()
          .min(1, "Username is required")
          .max(100),
        email: z.string()
          .min(1, "Email address is required")
          .email("Email Address is invalid"),
        password: z.string()
          .min(1, "Password is required")
          .min(6, "Password must be more than 6 characters")
          .max(32, "Password must be less than 32 characters"),
        password2: z.string()
          .min(1, "Please confirm your password")
      }).refine(data => data.password === data.password2, {
        path: ["password2"],
        message: "Passwords do not match"
      }))
    .mutation(async ({ ctx, input }) => {
      if (await ctx.prisma.user.findFirst({where: {
        name: input.name
      }})) {
        throw new Error(JSON.stringify('USERNAME_TAKEN'))
      }
      if (await ctx.prisma.user.findFirst({where: {
        email: input.email
      }})) {
        throw new Error(JSON.stringify('EMAIL_IN_USE'))
      }

      const hashedPassword = await bcrypt.hash(input.password, 10)
      return ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
          emailVerified: null,
        }
      })
    })
});