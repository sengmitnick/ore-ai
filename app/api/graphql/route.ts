import { createYoga } from "graphql-yoga";
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import { DateTimeResolver } from "graphql-scalars";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import type PrismaTypes from "@pothos/plugin-prisma/generated";

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});

builder.queryType({});

builder.mutationType({});

export const Role = builder.enumType("Role", {
  values: ["USER", "ASSISTANT"] as const,
});

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email"),
    pwd: t.exposeString("pwd"),
    name: t.exposeString("name", { nullable: true }),
    chat: t.relation("chat"),
    profile: t.relation("profile"),
  }),
});

builder.prismaObject("Chat", {
  fields: (t) => ({
    id: t.exposeID("id"),
    user: t.relation("user"),
    prompt: t.relation("prompt"),
    messages: t.relation("messages"),
    examples: t.relation("examples"),
  }),
});

builder.prismaObject("Profile", {
  fields: (t) => ({
    id: t.exposeID("id"),
    bio: t.exposeString("bio", { nullable: true }),
    user: t.relation("user"),
  }),
});

builder.prismaObject("Message", {
  fields: (t) => ({
    id: t.exposeID("id"),
    role: t.expose("role", {
      type: Role,
    }),
    content: t.exposeString("content"),
    chat: t.relation("chat"),
  }),
});

builder.prismaObject("Example", {
  fields: (t) => ({
    id: t.exposeID("id"),
    role: t.expose("role", {
      type: Role,
    }),
    content: t.exposeString("content"),
    chat: t.relation("chat", { nullable: true }),
  }),
});

builder.prismaObject("Prompt", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    system: t.exposeString("system"),
    icon: t.exposeString("icon", { nullable: true }),
    chats: t.relation("chats"),
    categories: t.relation("categories"),
  }),
});

builder.prismaObject("Category", {
  fields: (t) => ({
    id: t.exposeID("id"),
    key: t.exposeString("key"),
    name: t.exposeString("name"),
    prompts: t.relation("prompts"),
  }),
});

builder.queryField("login", (t) =>
  t.prismaField({
    type: "User",
    args: {
      email: t.arg.string({ required: true }),
      pwd: t.arg.string({ required: true }),
    },
    nullable: true,
    resolve: async (query, _parent, args, _info) =>
      prisma.user.findFirst({
        ...query,
        where: {
          email: args.email,
          pwd: args.pwd,
        },
      }),
  })
);

builder.queryField("user", (t) =>
  t.prismaField({
    type: "User",
    args: {
      id: t.arg.id({ required: true }),
    },
    nullable: true,
    resolve: async (query, _parent, args, _info) =>
      prisma.user.findUnique({
        ...query,
        where: {
          id: Number(args.id),
        },
      }),
  })
);

builder.mutationField("signupUser", (t) =>
  t.prismaField({
    type: "User",
    args: {
      name: t.arg.string({ required: false }),
      email: t.arg.string({ required: true }),
      pwd: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, _info) =>
      prisma.user.create({
        ...query,
        data: {
          email: args.email,
          name: args.name,
          pwd: args.pwd,
        },
      }),
  })
);

builder.queryField("allCategory", (t) =>
  t.prismaField({
    type: ["Category"],
    resolve: async (query, _parent) => prisma.category.findMany({ ...query }),
  })
);

builder.queryField("category", (t) =>
  t.prismaField({
    type: "Category",
    args: {
      id: t.arg.id({ required: true }),
    },
    nullable: true,
    resolve: async (query, _parent, args, _info) =>
      prisma.category.findUnique({
        ...query,
        where: {
          id: Number(args.id),
        },
      }),
  })
);

const schema = builder.toSchema();

const handleRequest = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response: NextResponse },
});

export { handleRequest as GET, handleRequest as POST };
