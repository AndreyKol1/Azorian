from PIL import Image
from google.genai import types
from google import genai
from dotenv import load_dotenv
from utils.logging import get_logger
import os
import io

load_dotenv()

class GeminiService:
    def __init__(self, sys_prompt: str) -> None:
        self.sys_prompt = sys_prompt
        gemini_api_token = os.getenv("GEMINI_API")
        self.client = genai.Client(api_key=gemini_api_token)
        self.logger = get_logger("main")
    
    def generateOnImage(self, image_input) -> str:
        """
        Generate content based on an image.
        image_input can be either:
        - A file path (string)
        - File bytes (bytes)
        - PIL Image object
        """
        try:
            if isinstance(image_input, str):
                # File path
                self.logger.debug(f"Processing image from file path: {image_input}")
                with open(image_input, 'rb') as f:
                    image_bytes = f.read()
            elif isinstance(image_input, bytes):
                # Already bytes
                self.logger.debug("Processing image from bytes")
                image_bytes = image_input
            else:
                raise ValueError(f"Unsupported image input type: {type(image_input)}. Expected str (file path) or bytes.")
            
            response = self.client.models.generate_content(
                model='gemini-2.5-pro',
                config=types.GenerateContentConfig(
                    system_instruction=self.sys_prompt
                ),
                contents=[
                    types.Part.from_bytes(
                        data=image_bytes,
                        mime_type='image/jpeg',
                    ),
                    'Caption this image.'
                ]
            )
            self.logger.debug("Generated response based on the image")
            return response.text
            
        except Exception as e:
            self.logger.error(f"Error in generateOnImage: {e}")
            raise
    
    def generateOnText(self, user_input: str, *args, **kwargs) -> str:
        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=user_input,
                config=types.GenerateContentConfig(
                    system_instruction=self.sys_prompt
                )
            )
            return response.text
        except Exception as e:
            self.logger.error(f"Error in generateOnText: {e}")
            raise
