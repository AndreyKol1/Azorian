import requests
from typing import Optional, Dict, Any, List
import logging

logger = logging.getLogger("main")

class SpoonacularAPIError(Exception):
    pass

class SpoonacularService:
    def __init__(self, api_key: str) -> None:
        if not api_key:
            raise ValueError("API key cannot be empty")
        
        self.base_url = "https://api.spoonacular.com/recipes/complexSearch"
        self._api_key = api_key
        self.session = requests.Session()
        logger.debug("SpoonacularService: Initialized service")

    def __authorize_request(self, params: Dict[str, Any]) -> Dict[str, Any]:
        params["apiKey"] = self._api_key
        logger.debug("SpoonacularService: Authorized request")
        return params

    def get_recipes(
        self,
        liked_ingredients: Optional[List[str]] = None,
        disliked_ingredients: Optional[List[str]] = None,
        diet: Optional[str] = None,
        min_protein: Optional[int] = None,
        max_protein: Optional[int] = None,
        min_calories: Optional[int] = None,
        max_calories: Optional[int] = None,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        params = {"number": limit, "addRecipeNutrition": True}
        
        if liked_ingredients:
            params["includeIngredients"] = ",".join(liked_ingredients)
        if disliked_ingredients:
            params["excludeIngredients"] = ",".join(disliked_ingredients)
        if diet:
            params["diet"] = diet
        if min_protein is not None:
            params["minProtein"] = min_protein
        if max_protein is not None:
            params["maxProtein"] = max_protein
        if min_calories is not None:
            params["minCalories"] = min_calories
        if max_calories is not None:
            params["maxCalories"] = max_calories
            
        logger.debug(f"SpoonacularService: get_recepies with params: {params}")
        params = self.__authorize_request(params)
        
        try:
            logger.debug(f"SpoonacularService: Success")
            response = self.session.get(self.base_url, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            return data.get("results", [])
            
        except requests.exceptions.RequestException as e:
            logger.error(f"SpoonacularService: Request failed: {e}")
            raise SpoonacularAPIError(f"Failed to fetch recipes: {e}")
        except (KeyError, ValueError) as e:
            logger.error(f"SpoonacularService: Response parsing failed: {e}")
            raise SpoonacularAPIError(f"Invalid response format: {e}")

    def close(self):
        logger.debug(f"SpoonacularService: Close")
        self.session.close()
