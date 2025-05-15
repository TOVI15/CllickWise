from flask import Flask, request, jsonify
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# יצירת לקוח של OpenAI לפי הגרסה החדשה
client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    query = data.get("query")
    if not query:
        return jsonify({"error": "Missing query"}), 400

    prompt = f"""
    השאלה של המשתמש: "{query}"

    המבנה של הנתונים בצד לקוח:
    students = [{{ id, firstName, lastName, age, GroupId, status, registeredAt }}]

    ענה רק בפונקציית סינון אחת ב-JavaScript (למשל: s => s.age === 15), ללא קריאה ל-students.filter. 
    אל תוסיף טקסט, הסברים או תווים נוספים. 
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # שימי לב שהשם התקני הוא gpt-4o, לא gpt-4o-mini
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        answer = response.choices[0].message.content
        return jsonify({"result": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
