import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

client = genai.Client(api_key=api_key)


def get_ai_response(question):
    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=f"Answer briefly in simple words without special symbols. Question: {question}"
    )

    return response.text