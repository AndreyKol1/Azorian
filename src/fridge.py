from services.gemini_service import GeminiService
from PIL import Image
from typing import List
from utils.logging import get_logger
import re
import json



class FridgeAnalyzer:
    def __init__(self, img: str) -> None: # change
        prompt = """You are given a photo of the inside of a fridge. Analyze the image carefully and list all the visible food and beverage items you can identify.
                    Output format: A clean list of product names (e.g., "milk", "eggs", "orange juice", "cheddar cheese").
                    Example: ["milk", "cheese", "eggs"]
                    """
        self.fridge_model = GeminiService(sys_prompt=prompt)
        self.img = img
        self.logger = get_logger("main")

    def clean_output(self, output: str) -> str:
        cleaned = re.sub(r'^```json\s*|\s*```$', '', output, flags=re.MULTILINE)
        cleaned = cleaned.strip()
        cleaned = re.sub(r'[\x00-\x1F\x7F]', '', cleaned)
        return cleaned

    def generate_response(self) -> List[str]:
        response = self.fridge_model.generateOnImage(self.img)
        try:
            clean_output = self.clean_output(response)
            self.logger.debug(f"Generated a response with foog in the fridge from the photo: {clean_output}")
            return json.loads(clean_output)
        except json.JSONDecodeError:
            self.logger.error(f"Planner output was not valid JSON:\n{response}")
            raise