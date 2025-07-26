from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import CustomAgentExecutor
from tools import suggest_recipe, search_nutritional_info, final_answer, cooking_instruction
from IPython.display import display, Markdown
from fridge import FridgeAnalyzer

app = FastAPI()

allowed_origin = "https://localhost:5173"

app.add_middleware(
    CORSMiddleware,
    allow_origins=[allowed_origin],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

tools = [suggest_recipe, search_nutritional_info, final_answer, cooking_instruction]
agent_executor = CustomAgentExecutor(tools=tools)


class Item(BaseModel):
    name: str
    value: int


@app.post("/message")
async def receive_json(item: Item):
    message = item["body"]["message"]
    final_answer = agent_executor.invoke(message)
    return {"message": final_answer["answer"]}


@app.post("/media")
async def upload_image(user_message, file: UploadFile = File(...)): # FIX!!!!
    fridge = FridgeAnalyzer(file)
    list_of_products = fridge.generate_response()
    final_answer = agent_executor.invoke(f"{user_message} {list_of_products}")
    return {"message": final_answer}