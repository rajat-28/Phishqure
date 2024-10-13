import joblib
from sklearn.feature_extraction.text import CountVectorizer
from urllib.parse import urlparse

# Load the trained model and vectorizer
model = joblib.load('url_phishing_model.pkl')
vectorizer = joblib.load('vectorizer.pkl')

def trim_url(url):
    # Parse the URL
    global base_url
    parsed_url = urlparse(url)
    
    # Reconstruct the URL with only scheme and netloc (protocol + domain)
    base_url = f"{parsed_url.scheme}://{parsed_url.netloc}/"
    if (parsed_url.scheme == "chrome" or parsed_url.scheme=='chrome-extension') :
        base_url=f"https://{parsed_url.netloc}"

    print(f"The base urls is {base_url}")
    
    return base_url

def predict_url(url):
    # Trim the URL
    trimmed_url = trim_url(url)
    
    # Transform the trimmed URL using the vectorizer
    url_transformed = vectorizer.transform([trimmed_url])
    
    # Predict using the loaded model
    prediction = model.predict(url_transformed)
    
    # Return the prediction result
    return "Phishing" if prediction[0] == 0 else "Legitimate"

# Take input from the user
user_input_url = input("Enter the URL to check: ")

# Predict the result and display it
result = predict_url(user_input_url)
print(f"The URL is predicted to be: {result}")
