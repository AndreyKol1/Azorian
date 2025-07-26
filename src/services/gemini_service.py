from PIL import Image
from google.genai import types
from google import genai
from dotenv import load_dotenv
from utils.logging import get_logger
import os

load_dotenv("/home/dornierdo17/Desktop/Programming/Azorian/src/tools/config/.env")

class GeminiService:
    def __init__(self, sys_prompt: str) -> None:
        self.sys_prompt = sys_prompt
        gemini_api_token = os.getenv("gemini_api")
        self.client = genai.Client(api_key=gemini_api_token)
        self.logger = get_logger("main")


    def generateOnImage(self, image: Image.Image) -> str:
        with open(image, 'rb') as f:
            image_bytes = f.read()

            response = self.client.models.generate_content(
                model='gemini-2.5-pro',
                config=types.GenerateContentConfig(
                system_instruction=self.sys_prompt),
                contents=[
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type='image/jpeg',
                ),
                'Caption this image.'
                ]
            )
            self.logger.debug("Generated response based on the image on the photo")

        return response.text
    
    def generateOnText(self, user_input: str, *args, **kwargs) -> str:
        response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=user_input,
                config=types.GenerateContentConfig(
                    system_instruction=self.sys_prompt
                )
            )
        return response.text