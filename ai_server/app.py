from flask import Flask, request, jsonify
import openai
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

openai.api_key = api_key

app = Flask(__name__)
@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    query = data.get("query")
    student_data = data.get("students")

    if not query or not student_data:
        return jsonify({"error": "Missing data"}), 400

    prompt = f"""השאלה: {query}
רשימת תלמידות:
{student_data}
ענה תשובה ברורה עם רשימה אם צריך:"""

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{ "role": "user", "content": prompt }],
            temperature=0.3
        )
        answer = response.choices[0].message["content"]
        return jsonify({"result": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5005)
