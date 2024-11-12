
import google.generativeai as genai
from flask import Flask, render_template, request, jsonify

FACT_COUNT = 2
facts = []

def getModel():
  genai.configure(api_key="API_KEY")
  model = genai.GenerativeModel("gemini-1.5-flash")
  return model
  return response.text


app = Flask(__name__)
resourceData = { "resource1": 1683, "resource2": 4265 }

@app.route('/')
def index():
    animals = ["Giraffe", "Donkey", "Monkey"]
    facts = []
    model = getModel()
    for i in range(FACT_COUNT):
        prompt = "Give a random and distinct fun fact about" + animals[i]
        response = model.generate_content(prompt)
        randomFact = response.text
        facts.append(randomFact)
    return render_template("part1.html", data=facts)

@app.route('/puzzle', methods=['POST'])
def getResourceData():
    resourceData = request.json
    print("DATA : ",resourceData)
    return jsonify({'message': 'Data received successfully'})

@app.route('/puzzle', methods=['GET'])
def puzzle():
    return render_template("part2.html", data=resourceData)

@app.route('/rewardGame')
def rewardGame():
    return render_template("part3.html")


if __name__ == '__main__':
    app.run(debug=True)


    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    