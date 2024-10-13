import joblib
from sklearn.feature_extraction.text import CountVectorizer

# Load the trained model and vectorizer
model = joblib.load('url_phishing_model.pkl')
vectorizer = joblib.load('vectorizer.pkl')

def predict_url(url):
    # Transform the input URL using the vectorizer
    url_transformed = vectorizer.transform([url])
    
    # Predict using the loaded model
    prediction = model.predict(url_transformed)
    
    # Return the prediction result
    return "Phishing" if prediction[0] == 0 else "Legitimate"

# Take input from the user
user_input_url = input("Enter the URL to check: ")

# Predict the result and display it
result = predict_url(user_input_url)
print(f"The URL is predicted to be: {result}")