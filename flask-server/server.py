import webbrowser
import sys
from flask import Flask, request, redirect, jsonify, Response, json
import requests


from matplotlib import pyplot as plt
import matplotlib
import pandas as pd
import numpy as np
import os
import nltk
import re
import pickle
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Binary Relevance
from sklearn.multiclass import OneVsRestClassifier
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn import model_selection, feature_extraction, feature_selection, naive_bayes, pipeline, metrics, svm
from skmultilearn.problem_transform import BinaryRelevance
from sklearn.model_selection import cross_val_score
from nltk.stem import WordNetLemmatizer

# Performance metric
from sklearn.metrics import f1_score
# import spacy
from nltk.corpus import stopwords
from nltk.tokenize import TweetTokenizer
from nltk.tokenize import RegexpTokenizer
from nltk.stem import PorterStemmer
import seaborn as sns
from wordcloud import WordCloud
# nltk.download('stopwords')
# nlp=spacy.load("en_core_web_sm")
from collections import Counter


app = Flask(__name__)

movieDictionary = {
    "action": "28-action",
    "romantic": "10749-romance",
    "comedy": "35-comedy",
    "horror": "27-horror",
    "historical": "36-history",
    "fantasy": "14-fantasy",
    "sci-fi": "878-science%20fiction"
}


@app.route("/movie")
def startApp():
    return {"Sucess": "True"}


@app.route('/input_text', methods=['POST', 'GET'])
def input_text():
    searchQuery = request.json['movieDescription']
    genreList = classifyText(searchQuery)
    if(len(genreList) == 2):
        return app.response_class(response=json.dumps([]),
                                  status=200,
                                  mimetype='application/json')
    genreDict, allGenreMovieDict = openBrowser(genreList)
    print("Final Genre Dict: ", genreDict)
    commonMoviesSet = commonMovies(genreDict)
    print("Common Movies: ", commonMoviesSet)
    print("Common Genres: ", list(genreDict.keys()))
    genreMovieList = {}
    for genre in genreDict:
        genreMovieList[genre] = list(genreDict[genre].values())
    if len(genreDict.keys()) > 1 and len(commonMoviesSet) > 0:
        value = {"moviesPerGenre": genreMovieList, "commonMovies": commonMoviesSet, "allGenreMovieDict": allGenreMovieDict,
                 "predictedGenres": list(genreDict.keys())}
        response = app.response_class(response=json.dumps(value),
                                      status=200,
                                      mimetype='application/json')
    else:
        print("genreMovieList: ", genreMovieList)
        print("predictedGenres: ", list(genreDict.keys()))
        value = {"moviesPerGenre": genreMovieList, "allGenreMovieDict": allGenreMovieDict,
                 "predictedGenres": list(genreDict.keys())}
        response = app.response_class(response=json.dumps(value),
                                      status=200,
                                      mimetype='application/json')
    return response


def commonMovies(genreDict):
    commonMoviesSet = set()
    print("INSIDE Final Genre Dict: ", genreDict)
    for key in genreDict:
        print(key, " kV ")
    for genre in genreDict:
        if len(commonMoviesSet) == 0:
            commonMoviesSet = set(genreDict[genre].values())
            print("First Set: ", commonMoviesSet)
        else:
            print("Second Set: ", set(
                genreDict[genre].values()))
            print("Common Set: ", commonMoviesSet)
            commonMoviesSet = commonMoviesSet & set(
                genreDict[genre].values())
            print("Next Set: ", commonMoviesSet)
    print("Inside commonMovies: ", commonMoviesSet)
    return list(commonMoviesSet)


def getMovieData(genreMovieDict):
    response = requests.get(
        "https://api.themoviedb.org/3/discover/movie?api_key=166fc5f1c66b68173f6307f4af4a5091&with_genres=27")
    if response.status_code == 200:
        print("sucessfully fetched the data")
        print(response.json())
        movies = response.json()
        for movie in movies['results']:
            mid = movie['id']
            genreMovieDict[mid] = movie['title']
    else:
        print(
            f"Hello person, there's a {response.status_code} error with your request")


def openBrowser(genreList):
    genreDict = {}
    allGenreMovieDict = {}
    # genreList = re.sub("[^a-zA-Z]", " ", genreList)
    genreList = re.sub("[^a-zA-Z\-]", " ", genreList)

    genreList = genreList.split()

    print("Genre List op: ", genreList)

    for genre in genreList:
        genreMovieDict = {}
        print("openBrowser", genre)
        genreId = movieDictionary.get(genre).split("-")[0]
        genreUrl = 'https://www.themoviedb.org/genre/' + \
            movieDictionary.get(genre) + '/movie'

        # webbrowser.open_new(requests.get(
        #     genreUrl).url)

        response = requests.get(
            "https://api.themoviedb.org/3/discover/movie?api_key=166fc5f1c66b68173f6307f4af4a5091&with_genres=" + genreId)
        if response.status_code == 200:
            movies = response.json()
            for movie in movies['results']:
                mid = movie['id']
                genreMovieDict[mid] = movie['title']
                allGenreMovieDict[movie['title']] = mid
            genreDict[genre] = genreMovieDict
        else:
            print(
                f"Error: {response.status_code}")
    return genreDict, allGenreMovieDict


def getStopWords():
    stopwords_english = set(stopwords.words('english'))
    stopwords_english.update(['tells', 'gets', 'takes', 'take', 'one', 'two', 'asks', 'also', 'film',
                             'movie', 'see', 'tell', 'find', 'back', 'man', 'say', 'car', 'says', 'leave', 'go', 'goes'])
    return stopwords_english


def clean_text(text, all_stopwords):
    text = re.sub(r'[^\w\s]', '', text.lower().strip())
    text = re.sub("[^a-zA-Z]", " ", text)
    text = [w for w in text.split() if not w in all_stopwords]
    lemmatizer = WordNetLemmatizer()
    text = [lemmatizer.lemmatize(current_word) for current_word in text]

    # text = nltk.tag.pos_tag(text)
    # text = [word for word, tag in text if tag != 'NNP' and tag != 'NNPS']
    text = " ".join(text)
    return text


def testModels(user_input, clf, tfidf_vectorizer, multilable_binarizer):

    all_stopwords = getStopWords()
    clean_input = clean_text(user_input[0], all_stopwords)
    clean_input = tfidf_vectorizer.transform([clean_input])
    clean_input_pred = clf.predict(clean_input)
    return multilable_binarizer.inverse_transform(clean_input_pred)


def classifyText(movie_description):
    # with open("logisticRegresstionModel.txt", 'rb') as file:
    #     clf = pickle.load(file)
    # with open("tfidf_vectorizer.txt", 'rb') as file:
    #     tfidf_vectorizer = pickle.load(file)
    # with open("multilable_binarizer.txt", 'rb') as file:
    #     multilable_binarizer = pickle.load(file)
    with open("svm_model.txt", 'rb') as file:
        clf = pickle.load(file)
    with open("svm_tfidf.txt", 'rb') as file:
        tfidf_vectorizer = pickle.load(file)
    with open("svm_multilable_binarizer.txt", 'rb') as file:
        multilable_binarizer = pickle.load(file)

    prediction = testModels([movie_description], clf,
                            tfidf_vectorizer, multilable_binarizer)
    print(type(prediction[0]))
    print("Test Case 1: ", prediction[0])
    return str(prediction[0])


app.run(port=4999, debug=True)
