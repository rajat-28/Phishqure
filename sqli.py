import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from xgboost import XGBClassifier
from sklearn.metrics import classification_report
import pickle

file_path = 'sqli.csv'  #baniye ure data pauna
df = pd.read_csv(file_path, encoding='utf-16')
df['Sentence'] = df['Sentence'].fillna('')

# Ensure the 'Sentence' column is of type string
df['Sentence'] = df['Sentence'].astype(str)

df['Label'].fillna(0, inplace=True)

X = df['Sentence']
y = df['Label']

tfidf = TfidfVectorizer(max_features=5000)
X_tfidf = tfidf.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X_tfidf, y, test_size=0.2, random_state=42)
model = XGBClassifier(n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))
with open('xgboost_sql_injection_model.pkl', 'wb') as f:
    pickle.dump(model, f)
with open('tfidf_vectorizer.pkl', 'wb') as f:
    pickle.dump(tfidf, f)
print("Model and vec saved successfully!")
