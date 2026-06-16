from google import genai
from google.genai import types
from google.genai.errors import APIError
from schemas.inspection import InspectionLLMResponse
from ai.prompts import vision_prompts
def vision_llm(img_data: dict, SYSTEM_PROMPT: str, USER_PROMPT: str):
    client = genai.Client()
    
    # Packages the image safely for the SDK
    image_part = types.Part.from_bytes(
        data=img_data["data"],
        mime_type=img_data["mime_type"]
    )
    
    # List of valid, active alternative vision model names
    models_to_try = ['gemini-2.5-flash', 'gemini-3.5-flash']
    
    for idx, model_name in enumerate(models_to_try):
        try:
            print(f"Attempting analysis with model: {model_name}...")
            
            response = client.models.generate_content(
                model=model_name, 
                contents=[image_part, USER_PROMPT],
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    response_mime_type="application/json",
                    response_schema=InspectionLLMResponse,
                    temperature=0.1,  
                ),
            )
            return response.text
            
        except APIError as e:
            # Check if it's a 503 Overload or another temporary API issue
            if e.code == 503 and idx < len(models_to_try) - 1:
                print(f"⚠️ {model_name} is experiencing high demand (503). Switching to fallback...")
                continue
            else:
                # If all fallback options fail or a different error occurs, raise it
                print(f"❌ Failed processing asset image.")
                raise e

if __name__ == "__main__":
    import os
    
    if not os.environ.get("GEMINI_API_KEY"):
        print("Error: Please set your GEMINI_API_KEY environment variable.")
        exit(1)

    try:
        with open("/mnt/data/Code/ai-projects/gridwise/backend/ai/tower.jpg", "rb") as f:
            img_data = f.read()
    except FileNotFoundError:
        print("Error: Could not find the file at '../tower.png'")
        exit(1)

    SYSTEM_PROMPT, USER_PROMPT = vision_prompts()
    
    print(vision_llm(img_data, SYSTEM_PROMPT, USER_PROMPT))
