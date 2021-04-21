#!/usr/bin/env python
# coding: utf-8

# In[1]:


from nltk.tokenize import word_tokenize, sent_tokenize
from urllib.request import urlopen, Request
from bs4 import BeautifulSoup
from keras.datasets import imdb
import tensorflow as tf
from sklearn.svm import SVC
from nltk import word_tokenize, pos_tag
from nltk.stem import PorterStemmer, WordNetLemmatizer
from nltk.corpus import stopwords, wordnet
import nltk
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from string import punctuation
import numpy as np
import pandas as pd
import string
import joblib
import pickle
import os
import re
# scikilearn.__version__ == 0.22.2


# In[2]:


#nltk
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')


# # 1. Benchmark - Using VadarSentiment

# In[3]:


# New words and values to update the Lexicon.
new_words = {
    'crushes': 10,
    'beats': 5,
    'increase': 10,
    'increasing': 10,
    'long': 50,
    'misses': -5,
    'trouble': -10,
    'falls': -100,
    'drops': -100,
    'dropping': -200,
    'falling': -100
}


# In[4]:


analyser = SentimentIntensityAnalyzer()
# Example
#score = analyser.polarity_scores("Apple Stock Is Falling Again. Why That’s Not a Problem for the Dow.")
#print(score)
analyser.lexicon.update(new_words)
# Example
#score = analyser.polarity_scores("Apple Stock Is Falling Again. Why That’s Not a Problem for the Dow.")
#print(score)


# # 2. Using LSTM model trained on IMDB dataset from tensorflow

# In[5]:


def pad_to_size(vec, size):
    zeros = [0] * (size - len(vec))
    vec.extend(zeros)
    return vec


def sample_predict(sample_pred_text, encoder, pad, model):
    encoded_sample_pred_text = encoder.encode(sample_pred_text)

    if pad:
        encoded_sample_pred_text = pad_to_size(encoded_sample_pred_text, 64)
    encoded_sample_pred_text = tf.cast(encoded_sample_pred_text, tf.float32)
    predictions = model.predict(tf.expand_dims(encoded_sample_pred_text, 0))

    return (predictions)


# ## Load model

# In[6]:

THIS_FOLDER = os.path.dirname(os.path.abspath(__file__))
my_file = os.path.join(THIS_FOLDER, 'saved_model/lstm_encoder.pickel')
encoder_loaded = pickle.load(open(my_file, "rb"))

my_file = os.path.join(THIS_FOLDER, 'saved_model/lstm')
lstm_loaded = tf.keras.models.load_model(my_file)

# Check its architecture
lstm_loaded.summary()


# In[7]:


#new_prediction = sample_predict("Apple Stock Is Falling Again. Why That’s Not a Problem for the Dow.",
#                                encoder=encoder_loaded, pad=False, model=lstm_loaded)
#print(new_prediction)


# # 3. Building a Neural Network and train on IMDB Dataset

# ## Text preprocessing

# In[8]:


TOP_WORDS = 10000


# In[9]:


stop_words = set(stopwords.words("english"))
ps = PorterStemmer()


# In[10]:


word2index = imdb.get_word_index()
word2index = {k: (v+3) for k, v in word2index.items()}
#word_to_id["<PAD>"] = 0
#word_to_id["<START>"] = 1
#word_to_id["<UNK>"] = 2
# Tweet preprocessing


def clean_symbols(text):

    for char in text:
        # remove punctuation but preserve symbols defined above
        if char in string.punctuation and char != ' ':
            text = text.replace(char, '')
        # remove all other characters
        if char.isalpha() is False and char.isdigit() is False and char != ' ':
            text = text.replace(char, '')

    return ' '.join(text.split())


def clean_words(news, dimension=TOP_WORDS):
    cleaned = clean_symbols(news).lower()
    test = []
    for word in word_tokenize(cleaned):
        if word in word2index:
            test.append(word2index[word])

    results = np.zeros(dimension)
    for _, sequence in enumerate(test):
        if sequence < dimension:
            results[sequence] = 1

    #print("\nOriginal string:", news,"\n")
    #print("\nIndex conversion:", test,"\n")
    results = np.reshape(results, (1, TOP_WORDS))
    #print("\nConvert to vectors:", results,"\n")
    return results


# ## Example
# In[11]:
#example_1 = "The movie was not good. The animation and the graphics were terrible. I would not recommend this movie."
#example_2 = "it is so good"
#example_3 = "Apple Stock Is Falling Again. Why That’s Not a Problem for the Dow."


def predict_sentiment(x_test, NN):

    x_test = clean_words(x_test, dimension=TOP_WORDS)
    #print(x_test.shape)
    prediction = NN.predict(x_test)
    #print(prediction)
    return prediction


# ## Load the model

# In[12]:

my_file = os.path.join(THIS_FOLDER, 'saved_model/nn')
NN_loaded = tf.keras.models.load_model(my_file)

# Check its architecture
NN_loaded.summary()

#predict_sentiment("it is good and let's have a try", NN_loaded)


# # SVC trained on another dataset

# In[13]:


# making list stopwords for removing stopwords from our text
stop = set(stopwords.words('english'))
stop.update(punctuation)
#print(stop)


# In[14]:


# this function return the part of speech of a word.
def get_simple_pos(tag):
    if tag.startswith('J'):
        return wordnet.ADJ
    elif tag.startswith('V'):
        return wordnet.VERB
    elif tag.startswith('N'):
        return wordnet.NOUN
    elif tag.startswith('R'):
        return wordnet.ADV
    else:
        return wordnet.NOUN


# In[15]:

def cleanText(text):
    text = BeautifulSoup(text, "lxml").text
    text = re.sub(r'\|\|\|', r' ', text) 
    text = re.sub(r'http\S+', r'<URL>', text)
    text = text.lower()
    text = text.replace('x', '')
    
    clean_text = []
    for w in word_tokenize(text):
        if w.lower() not in stop:
            clean_text.append(w)
    return clean_text

def join_text(text):
    return " ".join(text)


# ## Load the model

# In[16]:

my_file = os.path.join(THIS_FOLDER, 'saved_model/count_vector.pickel')
# load pickle
count_vec_loaded = pickle.load(open(my_file, "rb"))

# load
my_file = os.path.join(THIS_FOLDER, 'saved_model/svc.pkl')
svc_loaded = joblib.load(my_file)


# In[17]:


def svc_predict(svc, count_vec, news):
    news_processed = cleanText(news)
    news_processed = join_text(news_processed)

    test_news = count_vec.transform([news_processed]).todense()
    return svc.predict_proba(test_news)


# In[18]:


#print(svc_predict(svc_loaded, count_vec_loaded,
                  #"Investors are looking to buy more stocks"))


# # Combine all models together to give the final rating

# In[95]:


def predict_rating(news, if_print=False):
    benchmark_rating = analyser.polarity_scores(news)['compound']

    # Predicted by LSTM model, using padding = True
    rating_lstm = sample_predict(
        news, encoder_loaded, pad=True, model=lstm_loaded)[0][0]

    # predicted by NN
    rating_NN = predict_sentiment(news, NN_loaded)[0][0]

    # predictd by SVC
    rating_svc = svc_predict(svc_loaded, count_vec_loaded, news)[0]

    if if_print:
        print(f'result from vadar: {benchmark_rating:.2f}')
        print(f'result from lstm: {rating_lstm:.2f}')
        print(f'result from Neural Network: {rating_NN:.2f}')
        print(
            f"result from SVC: positive:{rating_svc[2]:.2f}, neutral:{rating_svc[1]:.2f}, negative:{rating_svc[0]:.2f}")

    # if (benchmark_rating < 0.5 and rating_lstm < 0 and rating_NN < 0.5) or benchmark_rating < 0 or rating_NN < 0.2 or (rating_svc[0] > 0.5 and np.argmax(rating_svc) == 0):
    #     return "Strong Negative"
    # elif (benchmark_rating >= 0.5 and rating_lstm >= 0 and rating_NN >= 0.5) or (benchmark_rating >= 0.8 or rating_NN >= 0.8) or (rating_svc[2] > 0.5 and np.argmax(rating_svc) == 2):
    #     return "Strong Positive"
    # elif benchmark_rating >= 0.5 and rating_lstm >= 0 and rating_svc[-1] > rating_svc[0]:
    #     return "Positive"
    # elif benchmark_rating < 0.5 and rating_lstm < 0 or rating_svc[0] > rating_svc[-1]:
    #     return "Negative"
    # else:
    #     return "Neutral"
    
    if np.argmax(rating_svc) == 2:
        # the news is in the positive side
        if benchmark_rating >= 0.05 and rating_lstm >=0 and rating_NN >= 0.5:
            return "Strongly Positive", rating_svc[2]
        elif benchmark_rating >= 0.05 or rating_lstm >=0 or rating_NN >= 0.5:
            return "Slightly Positive", rating_svc[2]
        else:
            return "Positive", rating_svc[2]

    elif np.argmax(rating_svc) == 0:
        # the news is in the negative side
        if benchmark_rating <-0.05 and rating_lstm <0 and rating_NN < 0.5:
            return "Strongly Negative", rating_svc[0]* -1
        elif benchmark_rating <-0.05 or rating_lstm <0 or rating_NN < 0.5:
            return "Slightly Negative", rating_svc[0] * -1
        else:
            return "Negative", rating_svc[0] * -1

    else:
        if benchmark_rating < -0.05:
            return "Negative", rating_svc[0] * -1
        if benchmark_rating > 0.05:
            return "Positive", rating_svc[2]
        if rating_svc[1] > 0.7:
            return "Neutral", rating_svc[1] * 0
        else:
            if rating_svc[0] > rating_svc[2]:
                return "Slightly Negative", rating_svc[0] * -1
            else:
                return "Slightly Positive", rating_svc[2]

def predict_news_series(news):
    result = predict_rating(news['Headline'])
    news["Sentiment"] = result[0]
    news["Score"]= result[1]
    return news

## referene: https://towardsdatascience.com/stock-news-sentiment-analysis-with-python-193d4b4378d4


# In[166]:
# Import libraries
def analyse_news_sentiment(tickers, n = 1):

    # Get Data
    finwiz_url = 'https://finviz.com/quote.ashx?t='
    news_tables = {}

    for ticker in tickers:
        url = finwiz_url + ticker
        req = Request(url=url, headers={'user-agent': 'my-app/0.0.1'})
        resp = urlopen(req)
        html = BeautifulSoup(resp, features="lxml")
        news_table = html.find(id='news-table')
        news_tables[ticker] = news_table

    try:
        for ticker in tickers:
            df = news_tables[ticker]
            df_tr = df.findAll('tr')

            #print('\n')
            #print('Recent News Headlines for {}: '.format(ticker))

            for i, table_row in enumerate(df_tr):
                a_text = table_row.a.text
                td_text = table_row.td.text
                td_text = td_text.strip()
                #print(a_text, '(', td_text, ')')
                if i == n-1:
                    break
    except KeyError:
        pass

    # Iterate through the news
    parsed_news = []
    for file_name, news_table in news_tables.items():
        i = 0
        for x in news_table.findAll('tr'):
            if i < n:
                #print(x)
                source = x.span.get_text()
                text = x.a.get_text()
                date_scrape = x.td.text.split()
                news_url = x.a['href']

                if len(date_scrape) == 1:
                    time = date_scrape[0]

                else:
                    date = date_scrape[0]
                    time = date_scrape[1]

                ticker = file_name.split('_')[0]

                parsed_news.append([ticker, date, time, text, news_url, source])
            else:
                break
            i += 1


    columns = ['Ticker', 'Date', 'Time', 'Headline', 'Link', 'Source']
    news = pd.DataFrame(parsed_news, columns=columns)

    # scores = news['Headline'].apply(analyser.polarity_scores).tolist()
    # df_scores = pd.DataFrame(scores)
    # news = news.join(df_scores, rsuffix='_right')

    # sentiments = news['Headline'].apply(predict_rating).tolist()
    # df_sentiments = pd.DataFrame(sentiments)
    # news = news.join(df_sentiments, rsuffix='_right')

    # news.rename(columns={0: 'Sentiment'}, inplace=True)
    news = news.apply(predict_news_series, axis = 1)
    # View Data
    news['Date'] = pd.to_datetime(news.Date).dt.date

    #unique_ticker = news['Ticker'].unique().tolist()
    #news_dict = {name: news.loc[news['Ticker'] == name] for name in unique_ticker}

    """ values = []
    for ticker in tickers:
        dataframe = news_dict[ticker]
        dataframe = dataframe.set_index('Ticker')
        #print('\n')
        #print(dataframe.head())
        mean = round(dataframe['compound'].mean(), 2)
        values.append(mean)

    df = pd.DataFrame(list(zip(tickers, values)), columns=[
                    'Ticker', 'Mean Sentiment'])
    df = df.set_index('Ticker')
    df = df.sort_values('Mean Sentiment', ascending=False) """

    return news
