##
import tensorflow as tf
import tensorflow_hub as hub
import csv
import numpy as np
from sklearn.metrics.pairwise import pairwise_distances
from sklearn.preprocessing import normalize
import tensorflow_text
import pandas as pd


##
!pip install tensorflow_text
##
import ssl
ssl._create_default_https_context = ssl._create_unverified_context
## https://tfhub.dev/google/universal-sentence-encoder-multilingual/3
# embed = hub.load("https://tfhub.dev/google/universal-sentence-encoder-multilingual/3")
embed = hub.load("https://tfhub.dev/google/universal-sentence-encoder-multilingual-large/3")
##
path = "/Users/ismailaslan/tensorflow_datasets/universal-sentence-encoder-multilingual-large_3"
embed = hub.load(path)
##
filename_negative = "/Users/ismailaslan/Dropbox/00_js/04_inputs/tr/tr_negative_emotions.txt"
#
negative_emotions = []
with open(filename_negative) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=';')
    for row in csv_reader:
        negative_emotions.append(row[0])
negative_emotions = np.array(negative_emotions)
print(negative_emotions)

##
filename_positive = "/Users/ismailaslan/Dropbox/00_js/04_inputs/tr/tr_positive_emotions.txt"
#
positive_emotions = []
with open(filename_positive) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=';')
    for row in csv_reader:
        positive_emotions.append(row[0])
positive_emotions = np.array(positive_emotions)
print(positive_emotions)
##
filename_stopwords = "/Users/ismailaslan/Dropbox/00_js/04_inputs/tr/tr_stopwords.txt"

stopwords = []
with open(filename_stopwords) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=';')
    for row in csv_reader:
        stopwords.append(row[0])
stopwords = np.array(stopwords)
print(stopwords)
##
filename_dictionary = "/Users/ismailaslan/Dropbox/00_js/04_inputs/tr/5000words.txt"

dictionary = []
brk =0
with open(filename_dictionary) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=';')
    # next(csv_reader)
    for row in csv_reader:
        d_word = row[0].split(" ")[0]
        dictionary.append(d_word)
        if len(d_word)<3 :
            print(d_word,brk)

        # if brk ==10:break
        brk+=1

print(len(dictionary))
## remove stop word and
for word in list(dictionary):
    if word in stopwords:
        dictionary.remove(word)
    # if len(word)<3:
    #     try:
    #         dictionary.remove(word)
    #     except: pass

dictionary = np.array(dictionary)
print(dictionary.shape)

##
def sim(emotion,word):
    embeddings = embed([
        emotion,
        word])
    pd = pairwise_distances(embeddings, metric='cosine')
    return 1-pd[0,1]
# print("distance=", pd[0,1])
# print("similarity=",1-pd[0,1])

##
def emotionScore(word,emotions):
    emotion_score = 0
    for emotion in emotions:
        # print(word,emotion)
        sim_temp = sim(emotion, word)
        emotion_score += sim_temp
        # print("temp=",sim_temp)
    emotion_score = emotion_score/len(emotions)
    # print("score=",emotion_score)
    return emotion_score
##
def standardizeArray(score_array):
    mu_neg = score_array.mean()
    std_neg = score_array.std()
    score_array_std = (score_array - mu_neg) / std_neg
    return score_array_std
##
pos_scores = []
for word in dictionary:
    emotion_score = emotionScore(word,positive_emotions)
    pos_scores.append(emotion_score)
    print(len(pos_scores))
pos_scores = np.array(pos_scores)
pos_scores = standardizeArray(pos_scores)
# print(pos_scores)
##
neg_scores = []
for word in dictionary:
    emotion_score = emotionScore(word,negative_emotions)
    neg_scores.append(emotion_score)
    print(len(neg_scores))
neg_scores = np.array(neg_scores)
neg_scores = standardizeArray(neg_scores)
# print(neg_scores)
##
import json
jsonFormattedScores = []
for i in range(len(pos_scores)):
    st = dictionary[i][0]
    if st != "'":
        # print("bulundu",dictionary[i])
        dict_temp = {"index":i,
                     'Word': dictionary[i],
                     "positiveScore": pos_scores[i],
                     "negativeScore":neg_scores[i]}
        jsonFormattedScores.append(dict_temp)

##
filePath = "/Users/ismailaslan/Dropbox/00_js/04_inputs/tr/"
fileName = filePath + "scores_" + str(dictionary.shape[0]) + "_tr_tokens" +".js"
with open(fileName, 'w') as outfile:
    outfile.write("var data_tr =")
    json.dump(jsonFormattedScores, outfile)

