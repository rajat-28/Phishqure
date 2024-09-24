from flask import Flask, request, jsonify
import pickle

# Load the model and vectorizer
with open('xgboost_sql_injection_model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('tfidf_vectorizer.pkl', 'rb') as f:
    tfidf = pickle.load(f)

# Initialize Flask app
app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to the SQL Injection Detection API!"

# Endpoint for prediction
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # Assuming input data is sent as JSON
    sentence = data.get('sentence')  # Extract the sentence from the input

    if not sentence:
        return jsonify({'error': 'No input provided'}), 400

    # Transform the input text using the loaded TF-IDF vectorizer
    transformed_sentence = tfidf.transform([sentence])

    # Make prediction using the loaded model
    prediction = model.predict(transformed_sentence)

    # Return the prediction result
    result = {'prediction': int(prediction[0])}  # Convert numpy type to regular Python int
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)  # Adjust port as needed
