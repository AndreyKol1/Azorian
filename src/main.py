from agent import CustomAgentExecutor
from tools import suggest_recipe, search_nutritional_info, final_answer, cooking_instruction
from IPython.display import display, Markdown
from fridge import FridgeAnalyzer


tools = [suggest_recipe, search_nutritional_info, final_answer, cooking_instruction]
agent_executor = CustomAgentExecutor(tools=tools)
fridge_analyzer = FridgeAnalyzer("/home/dornierdo17/Desktop/Programming/Azorian/images/fridge.jpg")
food_in_fridge = fridge_analyzer.generate_response()

final_answer = agent_executor.invoke(input=f"Give me a recipe that I can cook from the food in my fridge: {food_in_fridge}.")

