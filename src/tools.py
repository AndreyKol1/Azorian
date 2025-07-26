from langchain_core.tools import tool
from services.gemini_service import GeminiService
from dotenv import load_dotenv
from utils.logging import get_logger
import json
import requests
import os

load_dotenv()
logger = get_logger("main")

@tool
def suggest_recipe(user_input: str) -> str:
    """Suggest a recipe based on user preferences (e.g., 'high-protein, low-sugar breakfast')."""
    gemini = GeminiService(sys_prompt=f"""You are a recipe expert. Generate a real recipe name based on the user input: {user_input}""")
    return gemini.generateOnText(user_input)


@tool 
def search_nutritional_info(recipe_name: str) -> dict:
    """Return real nutritional info for the given recipe name."""
    prompt = (
        f"You are a nutrition expert. Given a recipe '{recipe_name}', "
        f"look for its nutrition. If you cannot retrieve the nutritional information from the web for this specific recipe"
        f"create your own nutritional information which is close to the real."
        f"Return in JSON format."
    )
    gemini = GeminiService(sys_prompt=prompt)
    response = gemini.generateOnText(recipe_name)

    try:
        return json.loads(response)
    except Exception:
        return {"error": "Failed to parse nutrition info", "raw_output": response}
    
@tool
def cooking_instruction(recipe_name: str) -> str:
    """Return an instruction on how to cook a given dish"""
    prompt = (
        f"You are a cooking expert. Given a recipe '{recipe_name}', "
        f"provide a detailed instruction on how to cook this dish."
    )
    gemini = GeminiService(sys_prompt=prompt)
    return gemini.generateOnText(recipe_name)

@tool
def final_answer(answer: str, tool_used: list[str]) ->str:
    """Use this tool to provide a final answer to the user.
    The answer should be in natural language as this will be provided
    to the user directly. The tool_used must include a list of tool
    names that were used within the `scratchpad`
    """
    return {"answer": answer, "tools_used": tool_used}
