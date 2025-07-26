from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langchain_core.runnables.base import RunnableSerializable
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from langchain_core.messages import ToolMessage
from utils.logging import get_logger
from typing import List
import json
import os

load_dotenv()
api_token_gemini = os.getenv("GEMINI_API")
os.environ["GOOGLE_API_KEY"] = api_token_gemini


prompt = ChatPromptTemplate.from_messages([
    ("system", (
        "You are a helpful assistant. When answering a user's question you should first use one of the tools provided."
        "After using a tool the tool output will be provided in the sratchpad' below. If you have an aswer in the scratchpad"
        "You should not use any more tools and instead answer directly to the user."
    )),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad")
])

class CustomAgentExecutor:
    chat_history: list[BaseMessage]

    def __init__(self, tools: List[str], max_iters: int = 4):
        self.chat_history = []
        self.max_iters = max_iters
        self.name2tool = {tool.name: tool.func for tool in tools}
        self.logger = get_logger("main")
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0,
            max_tokens=None,
            timeout=None,
            max_retries=2,
        )

        self.agent: RunnableSerializable = (
            {
                "input": lambda x: x["input"],
                "chat_history": lambda x: x["chat_history"],
                "agent_scratchpad": lambda x: x.get("agent_scratchpad", [])
            }
            | prompt
            | self.llm.bind_tools(tools, tool_choice="any")
        )

    def invoke(self, input: str) -> dict:
        count = 0 
        agent_scratchpad = []
        self.logger.info(f"Invoking agent with input: '{input}'")
        while count < self.max_iters:
            self.logger.debug(f"--- Iteration {count + 1} ---")
            tool_call = self.agent.invoke({
                "input": input,
                "chat_history": self.chat_history,
                "agent_scratchpad": agent_scratchpad
            })
            self.logger.debug(f"Tool call returned: {tool_call}")

            agent_scratchpad.append(tool_call)

            tool_call_obj = tool_call.tool_calls[0]
            tool_name = tool_call_obj["name"]
            tool_args = tool_call_obj["args"]
            tool_call_id = tool_call_obj["id"]

            self.logger.info(f"Calling tool '{tool_name}' with args: {tool_args}")
            tool_out = self.name2tool[tool_name](**tool_args)
            self.logger.info(f"Output from tool '{tool_name}': {tool_out}")

            # Handle non-dict outputs
            if isinstance(tool_out, str):
                try:
                    tool_out = json.loads(tool_out)
                except:
                    tool_out = {"answer": tool_out}

            tool_exec = ToolMessage(
                content=json.dumps(tool_out),
                tool_call_id=tool_call_id
            )
            agent_scratchpad.append(tool_exec)

            if tool_name == "final_answer":
                self.logger.info("Final answer tool called. Ending execution.")
                break

            count += 1

        final_answer = tool_out.get("answer", str(tool_out))
        self.chat_history.extend([
            HumanMessage(content=input),
            AIMessage(content=final_answer)
        ])

        self.logger.info(f"Returning final response: {final_answer}")
        return tool_out
