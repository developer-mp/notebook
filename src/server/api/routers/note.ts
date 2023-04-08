import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const noteRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.note.delete({
        where: {
          id: input.id,
        },
      });
    }),

  create: protectedProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.note.create({
        data: {
          title: input.title,
          content: input.content,
          userId: ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), title: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, title, content } = input;
      return ctx.prisma.note.update({
        where: { id },
        data: { title, content },
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.note.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
