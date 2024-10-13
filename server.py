
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from sklearn.feature_extraction.text import CountVectorizer
from urllib.parse import urlparse
import pickle

# Load the trained model and vectorizer for url detection 
model = joblib.load('url_phishing_model.pkl')
vectorizer = joblib.load('vectorizer.pkl')


# Load the sqlinjection model
with open('xgboost_sql_injection_model.pkl', 'rb') as model_file:
    model2 = pickle.load(model_file)

# Load the saved TF-IDF vectorizer
with open('tfidf_vectorizer.pkl', 'rb') as vectorizer_file:
    tfidf = pickle.load(vectorizer_file)

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from your browser extension


def trim_url(url):
    # Parse the URL
    parsed_url = urlparse(url)
    global base_url
    
    # Reconstruct the URL with only scheme and netloc (protocol + domain)
    base_url = f"{parsed_url.scheme}://{parsed_url.netloc}/"
    if (parsed_url.scheme == "chrome" or parsed_url.scheme=='chrome-extension') :
        base_url=f"https://{parsed_url.netloc}"

    
    return base_url

# Prediction function
def predict_url(url):

        # Trim the URL
    trimmed_url = trim_url(url)
    
    # Transform the trimmed URL using the vectorizer
    url_transformed = vectorizer.transform([trimmed_url])
    
    # Predict using the loaded model
    prediction = model.predict(url_transformed)
    
    # Return the prediction result
    return "Phishing" if prediction[0] == 0 else "Legitimate"

# Prediction for the queries
def predict_sql_injection(sentence):
    # Ensure the input is in the correct format
    if not sentence:
        return None

    # Transform the input text using the loaded TF-IDF vectorizer
    transformed_sentence = tfidf.transform([sentence])


    # Make a prediction using the loaded model
    prediction = model2.predict(transformed_sentence)

    return "Warn" if  prediction[0] ==1 else "safe"

# Define a route for the API
@app.route('/predict', methods=['POST'])
def predict():
    # Ensure the request contains JSON data
    if request.is_json:
        data = request.get_json()
        url = data.get('input')        
        
        if url:
            # Use the model to predict the URL status
            result = predict_url(url)
            return jsonify({'prediction': result})
        else:
            return jsonify({'error': 'No URL provided'}), 400
    else:
        return jsonify({'error': 'Invalid input format, expected JSON'}), 400
    
@app.route('/submit',methods=['POST'])
def check():
    if request.is_json:
        print("form data received")

        data=request.get_json()
        username=str(data.get('username'))
        password=str(data.get('password'))

        print(f"Recieved username {username} and password {password}")
        print(f"type of username{type(username)}")

        username_check=predict_sql_injection(username)
        password_check=predict_sql_injection(password)
        print(f"username_check is {username_check}")
        print(f"password_check is {password_check}")
        # return jsonify({'Value':"the value of the username and password received"})

        if(username and password):
            return jsonify({'username':username_check,'password':password_check})
        else:
            return jsonify({'result':"no info provided"})




# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
