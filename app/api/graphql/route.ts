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
    prompt: t.relation("prompt", { nullable: true }),
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

builder.queryField("chat", (t) =>
  t.prismaField({
    type: "Chat",
    args: {
      id: t.arg.id({ required: true }),
    },
    nullable: true,
    resolve: async (query, _parent, args, _info) =>
      prisma.chat.findUnique({
        ...query,
        where: {
          id: Number(args.id),
        },
      }),
  })
);

builder.queryField("chatMany", (t) =>
  t.prismaField({
    type: ["Chat"],
    args: {
      userId: t.arg.id({ required: true }),
    },
    nullable: true,
    resolve: async (query, _parent, args, _info) =>
      prisma.chat.findMany({
        ...query,
        where: {
          userId: Number(args.userId),
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
          chat: {
            create: [
              {
                examples: {
                  create: [
                    { content: "你好" },
                    {
                      role: "ASSISTANT",
                      content: "你好，请问有什么我可以帮助你的吗？",
                    },
                    { content: "你可以帮我做什么" },
                    {
                      role: "ASSISTANT",
                      content:
                        "我精通人类自然语言的交流方式，深入理解人类的需求。我可以跟您对话交流，帮您创作、获取信息。个人助理、学习帮手、工作报告、智能翻译、专业问题 等等，通通不在话下。",
                    },
                  ],
                },
              },
              {
                prompt: {
                  connect: { name: "取个英文名" },
                },
                examples: {
                  create: [
                    { content: "qiu yu qi" },
                    {
                      role: "ASSISTANT",
                      content: `女生：
1. yuki: 这个名字的发音与“qiu yu qi”相似，是一个充满活力和可爱的英文名。Yuki 活力、可爱、独立。
2.Kiki: 这个名字的发音与“qiu yu qi”相似，Kiki 这个名字的特点是俏皮、可爱。
3.Kelly：这个名字的发音与“qiu yu qi”相似，是一个充满自信和亲和力的英文名。Kelly 这个名字的特点是自信、亲和力、独立。
男生：
1. Kai（发音类似“Qi”）- 这个名字通常用于德国男性，意为“胜利者”，寓意勇敢坚强。
2. Ethan（发音类似“Yu-tan”）- 这个名字通常用于英国男性，意为“坚定的、稳固的”，寓意可靠稳重。`,
                    },
                  ],
                },
              },
              {
                prompt: {
                  connect: { name: "论文帮手" },
                },
                examples: {
                  create: [
                    { content: "帮我列一下有关城市环艺建设的论文提纲" },
                    {
                      role: "ASSISTANT",
                      content: `I. 研究背景和意义-介绍城市环境和艺术建设的关系 
II. 国内外城市环艺建设的现状和发展趋势 
III. 城市环艺建设的设计理念和方法 
IV. 城市环艺建设的实践案例分析 
V. 城市环艺建设的评价和展望-评价城市环艺建设的成效和问题 
VI. 结论和建议`,
                    },
                  ],
                },
              },
              {
                prompt: {
                  connect: { name: "小红书笔记生成" },
                },
                examples: {
                  create: [
                    {
                      content:
                        "请使用 Emoji 风格编辑以下段落，该风格以引人入胜的标题、每个段落中包含表情符号和在末尾添加相关标签为特点。请确保保持原文的意思。我的第一个内容是“推荐一下这条白裙子”",
                    },
                    {
                      role: "ASSISTANT",
                      content:
                        "👗💬 推荐一下这条白裙！   👀🛍️ 最近想要买一条白裙子，无意中发现了这条白裙，非常适合夏天的气息！   🌞💕 这条白裙是轻盈的棉质面料，非常透气，穿起来非常舒适。而且它的剪裁非常修身，很显身形。  💃💰💸价格也非常实惠，不到 100 元就能入手。总之，如果你正在寻找一条白裙，这条绝对值得一试！💯#时尚 #夏日 #白裙 #穿搭",
                    },
                  ],
                },
              },
              {
                prompt: {
                  connect: { name: "翻译助手" },
                },
                examples: {
                  create: [
                    { content: "昨夜西风凋碧树。独上高楼，望尽天涯路。" },
                    {
                      role: "ASSISTANT",
                      content:
                        "Last night the west wind withered the green trees, I climbed alone to the high tower, and looked far away to the end of the world.",
                    },
                    { content: "I came. I saw. I conquered." },
                    {
                      role: "ASSISTANT",
                      content:
                        "这句话出自古罗马将领凯撒的著名捷报，原文为法语 'Veni, vidi, vici' 意为 '我来了，我看见了，我征服了'。",
                    },
                  ],
                },
              },
              {
                prompt: {
                  connect: { name: "工作报告" },
                },
                examples: {
                  create: [
                    {
                      content:
                        "帮我写一份工作报告，主要包括 对接客户 辅导员工，要求 180 字。",
                    },
                    {
                      role: "ASSISTANT",
                      content:
                        "以下是一份关于工作的简短报告：在过去的几个月里，我一直在与客户进行对接，以确保我们的服务能够满足他们的需求。我与客户进行了定期的会议和沟通，以了解他们的反馈和意见，并根据他们的反馈来改进我们的服务。除了对接客户，我还在辅导员工方面做出了很多努力。我花了很多时间与员工沟通，以确保他们理解他们的工作职责和公司的目标。我还提供了一些培训和指导，以帮助员工提高他们的工作效率和质量。总的来说，我非常满意自己在这个岗位上的表现。我会继续与客户和员工保持密切联系，并尽我所能为公司做出更大的贡献。",
                    },
                    { content: "精简一点" },
                    {
                      role: "ASSISTANT",
                      content:
                        "我在过去几个月里与客户保持了密切联系，并根据他们的反馈不断改进我们的服务。此外，我还花了很多时间辅导员工，提高他们的工作效率和质量。我将继续为公司做出更大的贡献。",
                    },
                  ],
                },
              },
              {
                prompt: {
                  connect: { name: "塔罗牌占卜师" },
                },
                examples: {
                  create: [
                    { content: "开始" },
                    {
                      role: "ASSISTANT",
                      content:
                        "好的，请问您是否要自己抽牌，还是让我来为您抽取三张随机的塔罗牌进行占卜？",
                    },
                    { content: "你帮我随机抽三张" },
                    {
                      role: "ASSISTANT",
                      content:
                        "抽出的三张牌分别是：1. 正位的圣杯五 2. 倒位的星星 3. 正位的权杖八 请问您是否需要我为您解读这三张牌的含义，并回答您的问题？",
                    },
                    { content: "解读" },
                    {
                      role: "ASSISTANT",
                      content:
                        "这三张牌代表着积极的财务状况和成功，您已经拥有了足够的财富和资源，同时也具备克服财务挑战的能力和创新的理财方法。建议您继续保持良好的财务管理和理财习惯，同时也要寻找新的财务机会和创新的理财方法，以实现更多的财务成功。",
                    },
                  ],
                },
              },
              {
                prompt: {
                  connect: { name: "雅思写作考官" },
                },
                examples: {
                  create: [
                    {
                      content:
                        "我希望你假定自己是雅思写作考官，根据雅思评判标准，按我给你的雅思考题和对应答案给我评分，并且按照雅思写作评分细则给出打分依据。此外，请给我详细的修改意见并写出满分范文。",
                    },
                    {
                      role: "ASSISTANT",
                      content:
                        "好的，请告诉我你的雅思写作考题和答案，我将根据雅思评判标准进行评分和修改建议。",
                    },
                  ],
                },
              },
              {
                prompt: {
                  connect: { name: "随机吃什么" },
                },
                examples: {
                  create: [
                    { content: "午餐不知道吃什么好，随机一种给我，喜欢辣的。" },
                    {
                      role: "ASSISTANT",
                      content:
                        "好的，那我随机给您推荐一道辣的川菜—麻婆豆腐。这道菜口感麻辣，豆腐软糯鲜美，非常下饭，适合午餐。",
                    },
                    { content: "不喜欢豆腐 还有别的吗" },
                    {
                      role: "ASSISTANT",
                      content:
                        "好的，如果您不喜欢豆腐，我再给您推荐一道辣的川菜—一水煮牛肉。这道菜选用嫩牛肉，配以豆芽、木耳等蔬菜，味道鲜美，口感麻辣，非常适合喜欢辣味的人。",
                    },
                  ],
                },
              },
              {
                prompt: {
                  connect: { name: "计算机专业" },
                },
                examples: {
                  create: [
                    { content: "AlexNet" },
                    {
                      role: "ASSISTANT",
                      content:
                        "AlexNet 是一个著名的卷积神经网络模型，用于图像识别，在2012 年的 ImageNet 图像识别比赛中获得冠军，标志着卷积神经网络在计算机视觉领域的崛起。",
                    },
                    { content: "当时的优势是？" },
                    {
                      role: "ASSISTANT",
                      content: `AlexNet 在当时的优势主要有以下几点：
1. 更深的网络结构：相比之前的模型，AlexNet 使用了更深的网络结构，可以提取更多的特征信息。
2. 更大的数据集：AlexNet 使用了大规模的 ImageNet 数据集，包含超过100万张图片，可以更好地训练模型。
3. 使用了 ReLU 激活函数：相比之前的模型使用的 Sigmoid 激活函数，ReLU 激活函数可以更快地训练模型。
4. 使用了 Dropout 技术：Dropout 技术可以防止模型过拟合，提高模型泛化能力。
5. 使用了数据增强和 GPU 计算等技术：数据增强可以增加数据量，提高模型的鲁棒性；GPU 计算可以加速模型的训练。`,
                    },
                  ],
                },
              },
              {
                prompt: {
                  connect: { name: "基于文本的冒险游戏" },
                },
                examples: {
                  create: [
                    { content: "开始" },
                    {
                      role: "ASSISTANT",
                      content:
                        "你慢慢地睁开了眼睛，发现自己躺在一个陌生的房间里。房间里只有一张床和一扇窗户，窗户外面是一片浓密的森林。你感到头晕目眩，不知道自己是怎么到这里来的。现在你可以尝试着去寻找一些线索，来了解自己身处何处。",
                    },
                    { content: "去窗边看看" },
                    {
                      role: "ASSISTANT",
                      content:
                        "你走到窗边，向外面望去。你看到一片茂密的森林，树木高大，葱郁茂密。你发现窗户上有一张纸条，上面写着：“欢迎来到这个游戏，你需要通过各种谜题和挑战来逃离这个房间。祝你好运！” 纸条的下面还有一行字母和数字的组合：F3G7T2。你可以选择记下这个组合，或者将纸条撕下来带在身上。",
                    },
                  ],
                },
              },
            ],
          },
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

builder.queryField("prompt", (t) =>
  t.prismaField({
    type: ["Prompt"],
    resolve: async (query, _parent) => prisma.prompt.findMany({ ...query }),
  })
);

const schema = builder.toSchema();

const handleRequest = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response: NextResponse },
});

export { handleRequest as GET, handleRequest as POST };
