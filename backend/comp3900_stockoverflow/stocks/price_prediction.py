import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense, LSTM
import requests
import json
from datetime import datetime
import datetime

def prediction(raw_data):
    df = pd.DataFrame(raw_data)[['open','high','low','close','volume','date']]
    df.set_index("date", inplace=True)

    data = df.filter(['close'])
    dataset = data.values
    training_data_len = int(np.ceil( len(dataset) - 180 ))

    scaler = MinMaxScaler(feature_range=(0,1))
    scaled_data = scaler.fit_transform(dataset)

    train_data = scaled_data[training_data_len:-1, :]
    x_train = []
    y_train = []

    a = 0
    for i in range(20, len(train_data)):
        x_train.append(train_data[i-20:i, 0])
        y_train.append(train_data[i, 0])
        a += 1
        
    x_train, y_train = np.array(x_train), np.array(y_train)
    x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

    # Build the LSTM model
    model = Sequential()
    model.add(LSTM(128, return_sequences=True, input_shape= (x_train.shape[1], 1)))
    model.add(LSTM(64, return_sequences=False))
    model.add(Dense(25))
    model.add(Dense(1))

    # Compile the model
    model.compile(optimizer='adam', loss='mean_squared_error')

    # Train the model
    model.fit(x_train, y_train, batch_size=1, epochs=1)

    test_data = scaled_data[training_data_len - 20: , :]
    x_test = []
    y_test = dataset[training_data_len:, :]
    for i in range(20, len(test_data)):
        x_test.append(test_data[i-20:i, 0])
    
    x_test = np.array(x_test)

    x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1 ))

    # Get the predicted price values 
    predictions = model.predict(x_test)
    predictions = scaler.inverse_transform(predictions)
    predicted_price = [i for item in predictions for i in item]
    predicted_price.reverse()

    return predicted_price
