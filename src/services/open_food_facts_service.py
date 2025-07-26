import requests
from utils.logging import get_logger

class OpenFoodFactsService:
    BASE_URL = "https://world.openfoodfacts.net/api/v2/product/"

    def __init__(self, user_agent="OpenFoodFactsPythonWrapper/1.0"):
        self.headers = {"User-Agent": user_agent}
        self.logger = get_logger("main")

    def get_product_nutrition_facts(self, barcode):
        url = f"{self.BASE_URL}{barcode}?fields=product_name,nutriscore_data,nutriments,nutrition_grades"
        response = requests.get(url, headers=self.headers)

        if response.status_code != 200:
            self.logger.error(f"Error fetching data: {response.status_code}")
            raise Exception(f"Error fetching data: {response.status_code}")

        data = response.json()

        if data.get("status") != 1:
            self.logger.error(f"Product not found for barcode: {barcode}")
            raise Exception(f"Product not found for barcode: {barcode}")

        return data["product"]

