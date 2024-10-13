import pickle

# Load the saved model
with open('xgboost_sql_injection_model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

# Load the saved TF-IDF vectorizer
with open('tfidf_vectorizer.pkl', 'rb') as vectorizer_file:
    tfidf = pickle.load(vectorizer_file)

# Function to make a prediction
def predict_sql_injection(sentence):
    # Ensure the input is in the correct format
    if not sentence:
        print("No input provided")
        return

    # Transform the input text using the loaded TF-IDF vectorizer
    transformed_sentence = tfidf.transform([sentence])
    
    print(f"transformed_sentence is {transformed_sentence}")

    # Make a prediction using the loaded model
    prediction = model.predict(transformed_sentence)

    # Interpret the prediction
    if prediction[0] == 1:
        print("Warning: Potential SQL Injection detected!")
    else:
        print("No SQL Injection detected.")

# Example usage
if __name__ == '__main__':
    # Example sentence to test
    test_sentence = "abc"
    print(f"type of test_sentence is {type(test_sentence)}")
    predict_sql_injection(test_sentence)
