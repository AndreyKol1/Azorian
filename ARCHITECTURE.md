## 2. `ARCHITECTURE.md`

```markdown
# Architecture Overview

Below, sketch (ASCII, hand-drawn JPEG/PNG pasted in, or ASCII art) the high-level components of your agent.
![Agent Sketch](/home/dornierdo17/Downloads/AgentSketch.png)

## Components

1. **User Interface**  
   - E.g., Streamlit, CLI, Slack bot  

2. **Agent Core**  
   - **ReAct Agent** - the archicture of an agent is designed to first reason and then take an action based on the picked function from the user input. 

3. **Tools / APIs**  
   - **Gemini API** - Gemini API used for an agent and for other tools to provide a user with concise output based on the goal provided. 

4. **Observability**  
   - Logging of each reasoning step and the action taken

