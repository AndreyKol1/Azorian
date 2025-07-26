from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import CustomAgentExecutor
from tools import suggest_recipe, search_nutritional_info, final_answer, cooking_instruction
from IPython.display import display, Markdown
from fridge import FridgeAnalyzer
from utils.logging import get_logger 

app = FastAPI()

allowed_origin = "https://localhost:5173"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

tools = [suggest_recipe, search_nutritional_info, final_answer, cooking_instruction]
agent_executor = CustomAgentExecutor(tools=tools)
logger = get_logger("main")

class MessageRequest(BaseModel):
    message: str

class MediaRequest(BaseModel):
    image: str
    message: str

@app.post("/message")
async def receive_message(request: MessageRequest):
    logger.debug(f"Received request: {request}")
    logger.debug(f"Message: {request.message}")
    
    try:
        result = agent_executor.invoke(request.message)
        logger.debug(f"Agent response: {result}")
        return {"message": result["answer"]}
    except Exception as e:
        logger.error(f"Error processing message: {e}")
        return {"message": "Sorry, I encountered an error processing your request."}

@app.post("/media")
async def upload_image(message: str = Form(...), file: UploadFile = File(...)):
    logger.debug(f"Received message: {message}")
    logger.debug(f"Received file: {file.filename}")
    
    try:
        # Read the file content as bytes (properly await the async read)
        file_content = await file.read()
        logger.debug(f"Read {len(file_content)} bytes from uploaded file")
        
        # Pass the bytes directly to FridgeAnalyzer
        fridge = FridgeAnalyzer(file_content)
        list_of_products = fridge.generate_response()
        
        # Combine user message with detected products
        combined_message = f"{message} {list_of_products}"
        result = agent_executor.invoke(combined_message)
        
        logger.debug(f"Agent response: {result}")
        return {"message": result["answer"]}
    except Exception as e:
        logger.error(f"Error processing image: {e}")
        return {"message": "Sorry, I encountered an error processing your image."}
