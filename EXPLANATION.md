# Technical Explanation

## 1. Agent Workflow

1. The model recieves the model input(text or image). If it is the image, the further preprocessing is done: retrieving food from the fridge photo and passing it further.
2. We implemented ReAct agent, which includes reasoning(deciding which tool to call) and acting based on the chosen tool. 
3. Based on user goal, the model decided which tool to call from existing: generate a recipe, search nutricious for the given recipe, provide cooking instructions.
4. Agent returns information from the tools it decided to use.

## 2. Key Modules

- **ReAct Agent** (`agent.py`)
- **Tools** (`tools.py`)
- **GeminiService** (`gemini_service.py`)
- **FridgeService** (`fridge.py`)

## 3. Tool Integration

List each external tool or API and how you call it:
- **Recipe suggestion**: LLM function calling   
- **Provide nutrition info**: LLM function calling  
- **Provide instructions for cooking**: LLM function calling
- **Final answer generating**: LLM function calling

## 4. Observability & Testing

Explain your logging and how judges can trace decisions:
- Logs saved in `logs.txt` file. These include agent reasoning a tool executing logs. 

## 5. Known Limitations

The agent can provide information for one recipe at a time. 


