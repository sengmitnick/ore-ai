# ChatGPT App With Next.js

基于 Next.js 的 ChatGPT 应用，1024Code 提供了 AI 接口服务，让您立即开始开发您的AI应用。

## 应用介绍

> OreAI 聊天智能助手 AI对话写作

### 对话页

目前为了方便演示，首页就是对话页。进入首页会自动注册/登录一个用户，默认自带部分对话。

![对话页](https://assets.1024code.com/cos/assets/OreAI/1.png)

### 发现页

通过底部导航，切换到 发现页。可以选择不同的提示词新建对话

![发现页](https://assets.1024code.com/cos/assets/OreAI/2.png)

### 对话详情页

通过 对话页\发现页 进入相应的对话详情页。即可使用～

![对话详情页](https://assets.1024code.com/cos/assets/OreAI/3.png)

## 应用实现

OreAI 基于 Next.js 开发，后端层面使用了 prisma 和 GraphQL，数据库使用 1024Code 内置的 mysql，使用 turbo 缓存打包资产。具体实现应用代码在 `apps/web`。

PS: 1024Code 内置的 mysql，如果是新建的代码空间，需要先在资源管理添加

![内置mysql](https://assets.1024code.com/cos/assets/OreAI/6.png)

### 内置环境变量

1024Code 已经通过环境变量设置了`OPENAI_API_KEY`。`OPENAI_API_KEY`是一个动态的值，根据不同情况平台会自动注入。新注册用户默认只有1000次调用次数，用完后需要再次联系运营人员。

在已加入协作的代码空间中，`OPENAI_API_KEY`将使用代码空间的所有者的配额。

当你发布代码到社区或访问代码详情页时，将使用当前登录用户的配额。

对于未登录用户，将使用代码空间所有者的配额。

### Next.js 环境变量

在 `apps/web/.env` 文件存储了会在 OreAI 应用中用到的环境变量。

```bash
DATABASE_URL="mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}:${MYSQL_PORT}/oredb"
```

- DATABASE_URL        prisma 连接数据库的URL

### 对话功能实现

对话详情页的代码在 `apps/web/app/(sub)/chat/[id]/ChatPage.tsx`。以下是实现的关键代码片段，通过 fetchSSE 请求，处理返回的流数据。

```ts
const payload = {
  model: "gpt-3.5-turbo-16k",
  messages: chats,
  temperature: 0.7,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  max_tokens: 1024,
  stream: true,
  n: 1,
};

let text = "";
controllerRef.current = new AbortController();
// 通过 API 获取 OPENAI_API_KEY
// 目前使用 turbo 缓存打包资产，直接在前端获取会导致 Key 在发布到社区没有变化的问题
const ret = await fetch("/api/api_key", { method: "POST" });
const key = await ret.text();

// 使用 fetchSSE 函数向指定的 API 地址发送 POST 请求
fetchSSE(`https://llm.1024code.com/v1/chat/completions`, {
  // 设置请求头
  headers: {
    "Content-Type": "application/json",
    // 携带 API_KEY 进行身份认证
    Authorization: `Bearer ${key}`,
  },
  method: "POST", // 设置请求方法为 POST
  signal: controllerRef.current.signal, // 指定请求的控制器信号
  body: JSON.stringify(payload), // 将请求体转换为 JSON 字符串并发送
  // 当接收到消息时触发的回调函数
  onMessage: (data) => {
    if (!getLoad()) return;
    // 如果接收到的消息是"[DONE]"，则表示对话结束，设置加载状态为false，并添加消息到数据库
    if (data === "[DONE]") {
      setLoading(false);
      addMessage({
        variables: { chatId, role: Role.ASSISTANT, content: text },
      });
      return;
    }

    try {
      // 尝试将接收到的消息解析为JSON对象
      const ret = JSON.parse(data);
      const finish_reason = ret.choices[0].finish_reason;
      // 判断对话是否结束
      const finish = finish_reason === "stop" || finish_reason === "length";
      // 获取对话回复的内容
      const content = ret.choices[0].delta.content;
      // 如果对话结束，则设置加载状态为false
      if (finish) {
        setLoading(false);
      }
      // 如果对话未结束且有回复内容，则将回复内容添加到当前对话文本中，并更新对话列表
      else if (content) {
        text += content;
        update((prev) => {
          prev[0].content = text;
          return [...prev];
        });
      }
    } catch (error) {
      // 如果解析消息出错，则设置加载状态为false，并将当前对话设置为解析消息出错。
      console.log("error", error);
      setLoading(false);
      update((prev) => {
        prev[0].content = "解析消息出错";
        prev[0].error = true;
        return [...prev];
      });
    }
  },
  // 当请求出错时执行的回调函数
  onError: async (res) => {
    // 获取错误信息
    const content = await res.text();
    // 设置 loading 状态为 false
    setLoading(false);
    // 如果错误状态码为 403，则提示用户 API_KEY 调用额度已用完
    if (res.status == 403) {
      update((prev) => {
        prev[0].content =
          "当前 API_KEY 调用额度已用完，请联系运营人员增加额度";
        prev[0].error = true;
        return [...prev];
      });
      return;
    }
    // 否则将错误信息更新到聊天记录中
    update((prev) => {
      prev[0].content = content;
      prev[0].error = true;
      return [...prev];
    });
  },
}).catch(() => {
  setLoading(false);
  update((prev) => {
    prev[0].content = "未知错误";
    prev[0].error = true;
    return [...prev];
  });
});
```


### TODO

- 对话：处理上下文超过最大 tokens的问题（目前只能清空对话以继续进行）
- 对话：新用户示例对话第一次提问回答异常问题