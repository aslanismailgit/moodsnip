Can Artificial Intelligence detect your mood?

A different way of making surveys using word encoders…
One miracle of the Machine Learning studies in the area of Natural Language Processing, for sure, is word embeddings. But, the question is how to make use of it?
Last week I took TensorFlow Developer Exam and afterwards I have started to work on a new Natural Language Processing Project which, in fact, I have been waiting for completing the exam to start. Without going too much detail, and assuming the reader has a certain level of knowledge about Natural Language Processing and Machine Learning terms such as tokens, sequences, word embeddings, similarity etc., I will go directly to the subject. There are tons of blogs written to give much insight into the fore-mentioned subject areas.
One miracle of the Machine Learning studies in the area of Natural Language Processing, for sure, is word embeddings. I think it is amazing to have a vector (numbers !!!) for any word which can really “represent” a word semantically even showing similarities between words.
In many cases, NLP workers collects text pieces written by costumers, reviewers and twitters etc. But my question is if there is another way to collect users’ word preferences related to a subject.
Image for post
Image for post
Mood Detector !
The Mood Detector comes to help us at this point. It lets the user to select a word out of several pop-up words. The basic assumption is the mood you are in that moment will effect the word you choose. In fact that is what we do in our writings every day. Then, it calculates the word similarities between selected words and positive and negative emotions [1]. (TensorFlow Universal Sentence Encoder is used for word embeddings)
Positive emotions: Interest, Inspiration, Enthusiasm, Laughter, Amusement, Empathy, Curiosity, Contentment, Calmness, Serenity, please see reference for the entire list.
Negative emotions: Sorrow, Heartache, Sadness, Unhappiness, Depression, Hatred, Blame, Regret, Misery, Resentment, please see reference for the entire list.
Positive/negative scores: For each word, the positive and negative scores are calculated by summing the similarities between selected word and the each emotion given in the list above, then taking an average over the number of words in the emotions list.
def emotionScore(word, emotions):
    emotion_score = 0
    for emotion in emotions:
        sim_temp = similarity(emotion, word)
        emotion_score += sim_temp
    emotion_score = emotion_score/len(emotions)
    return emotion_score
Total Score: Since any word has either a positive or a negative score, total score for a word can be calculated as (positive score — negative score). Take “joy” as an example:
positive score(joy) = 4.5870958373651565
negative score(joy) = 1.75512169212998
total score(positive score — negative score)(joy) = 2.8319741452351765
Another example is “upset”:
positive score (upset)=3.079210599054119
negative score (upset) =4.947923935166632
total score(positive score — negative score) (upset)=-1.8687133361125134
That is interesting that both joy and upset has positive and negative emotion score at the positive side (bigger than zero). That is because they both represent emotions and have a similarity at a certain level.
But the semantic similarity effects the magnitude of the scores. The word which has stronger relations with one of the emotion group will have a higher score.
According to pure positive, pure negative and total (positive — negative) scores, the words below get the highest 10 scores (out of 9679 words).
Image for post
An example: The overall score is calculated as above for the selected group of words. For example, prompting 10 times with 4 options, the user selects 10 words. The positive and negative scores are calculated for each word. Then total scores of all ten words are summed up.
Image for post
Total score distribution of word sample space
There are 9679 words in the sample space. As you see below Total Score distribution has a normal distribution with a mean of zero and 2.7 standard deviation. (positive and negative scores are standardized in the previous phase)
Image for post
In order to show the differences between scores close to zero, a tailored tanh function is used, so that all values scale into 0 and 100. That is to say, if your score moves a delta unit from zero into the positive direction, your displayed mood score will move into the same direction more than delta, if the score is close to zero.
Image for post
Mood Score Transformation Function
Measuring user’s attitude toward a given subject ( a brand, an idea, a controversial subject) using ML.
Another application similar to the above might be to put a word in the middle -lets say a brand or maybe a phenomenon such as racism- and show user 4 random words and ask the user to select the word which he/she thinks is most related to the one in the middle. Then we can calculate the similarity between the selected words and any target area, like quality, trust etc.
Image for post
I created a web app that tries to detect the mood of the user using the above methodology. Follow this link and see if it works for you. Please note that if your score is larger than %50, you are in good mood.( I am sure you are %100 positive, after reading this article :-)
Reference:
[1] What are Positive and Negative Emotions and Do We Need Both? https://positivepsychology.com/positive-negative-emotions/ 
