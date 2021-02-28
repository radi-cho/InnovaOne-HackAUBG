import os
import re
import numpy as np

import tensorflow as tf
from tensorflow import keras

from tensorflow.keras.preprocessing.text import Tokenizer
import json

data = json.load(open('train_confusion.json', encoding='utf-8'))

valid_rows = []
labels = []

i = 0
for label in data[1]:
  if len(data[0][i].strip()) == 0:
    pass
  elif label == 'High':
    labels.append(1)
    valid_rows.append(re.sub('\?|\.|\!|\/|\;|\:|\,|\(|\)|\[|\…|\]|\"', '', data[0][i]).lower())
  elif label == 'Low':
    labels.append(0)
    valid_rows.append(re.sub('\?|\.|\!|\/|\;|\:|\,|\(|\)|\[|\…|\]|\"', '', data[0][i]).lower())
    pass
  i+=1

train_size = round(len(valid_rows))
print(train_size)
train_data = valid_rows[0:train_size]
train_labels = labels[0:train_size]
test_data = valid_rows[train_size:]
test_labels = labels[train_size:]

VOCAB_SIZE = 10000
encoder = tf.keras.layers.experimental.preprocessing.TextVectorization(max_tokens=VOCAB_SIZE)
encoder.adapt(train_data)

vocab = np.array(encoder.get_vocabulary())

model = tf.keras.Sequential([
    encoder,
    tf.keras.layers.Embedding(
        input_dim=len(encoder.get_vocabulary()),
        output_dim=64,
        mask_zero=True),
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(64, return_sequences=True)),
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(32)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(1)
])

model.compile(loss=tf.keras.losses.BinaryCrossentropy(from_logits=True),
              optimizer=tf.keras.optimizers.Adam(1e-4),
              metrics=['accuracy'])

train_bytes = [str.encode(x) for x in train_data]
test_bytes = [str.encode(x) for x in test_data]

history = model.fit(train_bytes, train_labels, epochs=30,
                    validation_data=(test_bytes, test_labels), 
                    validation_steps=30
                    )

model.save('posneg')