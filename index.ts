import { ChatOllama } from "@langchain/ollama";
import { createAgent } from "langchain";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import fs from "fs";

const model = new ChatOllama({ model: "qwen3:4b" });
const base = "./workspace";
if (!fs.existsSync(base)) fs.mkdirSync(base);

const writeFile = tool(
  async ({ name, content }) => {
    fs.writeFileSync(`${base}/${name}`, content);
    return "done";
  },
  {
    name: "write_file",
    schema: z.object({ name: z.string(), content: z.string() }),
  }
);

const agent = createAgent({ model, tools: [writeFile] });

agent.invoke({
  messages: "Create file neel.txt and write hello neel lol",
}).then(r =>
  console.log(r.messages.at(-1)?.content)
);