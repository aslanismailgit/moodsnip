##
import tensorflow as tf
import tensorflow_hub as hub
import csv
import numpy as np
from sklearn.metrics.pairwise import pairwise_distances
from sklearn.preprocessing import normalize

import pandas as pd
##
filename_negative = "../negative_emotions.txt"
#
negative_emotions = []
with open(filename_negative) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=';')
    for row in csv_reader:
        negative_emotions.append(row[0])
negative_emotions = np.array(negative_emotions)
print(negative_emotions)

##
filename_positive = "../positive_emotions.txt"
#
positive_emotions = []
with open(filename_positive) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=';')
    for row in csv_reader:
        positive_emotions.append(row[0])
positive_emotions = np.array(positive_emotions)
print(positive_emotions)
##
stopwords = [ "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at",
              "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "could", "did", "do",
              "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have",
              "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself",
              "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "it", "it's", "its",
              "itself", "let's", "me", "more", "most", "my", "myself", "nor", "of", "on", "once", "only", "or", "other",
              "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she'll", "she's",
              "should", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves",
              "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those",
              "through", "to", "too", "under", "until", "up", "very", "was", "we", "we'd", "we'll", "we're", "we've",
              "were", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom",
              "why", "why's", "with", "would", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself",
              "yourselves" ]
##
filename_dictionary = "../metadata-edited.txt"

dictionary = []

with open(filename_dictionary) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=';')
    next(csv_reader)
    for row in csv_reader:
        d_word = row[0].split("\t")[0]
        dictionary.append(d_word)

print(len(dictionary))
## remove stop word and words are less than 3 char
for word in list(dictionary):
    if word in stopwords:
        dictionary.remove(word)
    if len(word)<3:
        try:
            dictionary.remove(word)
        except: pass

dictionary = np.array(dictionary)
print(dictionary.shape)
##
import ssl
ssl._create_default_https_context = ssl._create_unverified_context
##
embed = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")
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
    dict_temp = {"index":i,
                 'Word': dictionary[i],
                 "positiveScore": pos_scores[i],
                 "negativeScore":neg_scores[i]}
    jsonFormattedScores.append(dict_temp)

##
filePath = "../mood/"
fileName = filePath + "scores_" + str(dictionary.shape[0]) + "_tokens" +".js"
with open(fileName, 'w') as outfile:
    outfile.write("var data =")
    json.dump(jsonFormattedScores, outfile)

##
import pandas as pd
import numpy as np
##
filename_dictionary = "../scores_9679_tokens.json"
df = pd.read_json(filename_dictionary)
##
df["TotalScore"]=df["positiveScore"] - df["negativeScore"]
df.head()
##
df1 = df.sort_values(by=['positiveScore'],ascending=False)[["Word",'positiveScore']][:10]
df2 = df.sort_values(by=['negativeScore'],ascending=False)[["Word",'negativeScore']][:10]
df3 = df.sort_values(by=['TotalScore'],ascending=False)[["Word",'TotalScore']][:10]
## plot
import seaborn as sns
import matplotlib.pyplot as plt
sns.set(style="whitegrid")
f, ax = plt.subplots(1,3, constrained_layout=True, figsize=(8,4))

sns.set_color_codes("pastel")
sns.barplot(x='positiveScore', y='Word', data=df1, palette="Greens_d",ax=ax[0])
ax[0].set_xlabel('Positive Scores')
ax[0].set(ylabel="")

sns.barplot(x='negativeScore', y='Word', data=df2, palette="Reds_d", ax=ax[1])
ax[1].set_xlabel('Negative Scores')
ax[1].set(ylabel="")


sns.barplot(x='TotalScore', y='Word', data=df3, palette="Blues_d",ax=ax[2])
ax[2].set_xlabel('(Positive - Negative) Scores')
ax[2].set(ylabel="")

f.suptitle("10 Highest Scored Words")
plt.show()
## some investigations
import matplotlib.pyplot as plt
plt.plot(df["index"],df["positiveScore"])

##
ax = df["positiveScore"].plot.hist(bins=12, alpha=0.5)
ax = df["negativeScore"].plot.hist(bins=12, alpha=0.5)

##
pos_max = np.argmax(df["positiveScore"])
print(pos_max,df["Word"][pos_max])
neg_max = np.argmax(df["negativeScore"])
print(neg_max,df["Word"][neg_max])
tot_score_max = np.argmax(df["TotalScore"])
print(tot_score_max,df["Word"][tot_score_max])
tot_neg_score_max = np.argmax(df["ThemostNegativeTotScore"])
print(tot_neg_score_max,df["Word"][tot_neg_score_max])
tot_score = np.argmax(df["TotScore"])
print(tot_score,df["Word"][tot_score])
##
pos_max = np.argmin(df["positiveScore"])
print(pos_max,df["Word"][pos_max])
neg_max = np.argmin(df["negativeScore"])
print(neg_max,df["Word"][neg_max])
tot_score_max = np.argmin(df["TotalScore"])
print(tot_score_max,df["Word"][tot_score_max])
tot_neg_score_max = np.argmin(df["ThemostNegativeTotScore"])
print(tot_neg_score_max,df["Word"][tot_neg_score_max])
tot_score = np.argmin(df["TotScore"])
print(tot_score,df["Word"][tot_score])
##
word = "upset"
ind = df["index"][df["Word"]==word].values[0]
print(word, ind)
word_pos = df["positiveScore"][ind]
print(word_pos)
word_neg = df["negativeScore"][ind]
print(word_neg)

word_tot_pos = df["TotalScore"][ind]
print(word_tot_pos)

word_tot_neg = df["ThemostNegativeTotScore"][ind]
print(word_tot_neg)

word_tot_score = df["TotScore"][ind]
print(word_tot_score)

##
word = "equality"
ind = df["index"][df["Word"]==word].values[0]
print(word, ind)
word_pos = df["positiveScore"][ind]
print(word_pos)
word_neg = df["negativeScore"][ind]
print(word_neg)

word_tot_pos = df["TotalScore"][ind]
print(word_tot_pos)

word_tot_neg = df["ThemostNegativeTotScore"][ind]
print(word_tot_neg)

##
n = 10
m = 4
for i in range(100):
    tot_pos_score = sum(df['positiveScore'].sample(n=n))
    print("positive score =", tot_pos_score)
    tot_neg_score = sum(df['negativeScore'].sample(n=n))
    print("negative score =",tot_neg_score)
    score = (tot_pos_score - tot_neg_score)/n + 2*m
    print("score =",tot_neg_score)

##
df["ThemostNegativeTotScore"]= - df["positiveScore"] + df["negativeScore"]
df["TotScore"]= + df["positiveScore"] + df["negativeScore"]
df.head()

##
df.sort_values(by=['ThemostNegativeTotScore'],ascending=False)["Word"][:10]
df.sort_values(by=['TotScore'],ascending=False)["Word"][:10]

##

