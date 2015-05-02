# --- animals --- 10778
# --- food_drink --- 11388
# --- travel --- 10978
# --- kids --- 10722

import json

categories = [
    'animals',
    'food_drink',
    'travel',
    'kids'
]

number_of_samples = [0] * len(categories)
number_of_words = [0] * len(categories)
total_words_count = [0] * len(categories)
dictionary = {}


for index, category in enumerate(categories):
    with open('%s.dict' % category, 'r') as f:
        data = json.loads(f.read())
    number_of_samples[index] = data['number_of_samples']
    number_of_words[index] = data['number_of_words']
    total_words_count[index] = data['total_words_count']

    print category, data['number_of_words']

    for word, word_count in data['dictionary'].iteritems():
        if word not in dictionary:
            dictionary[word] = [0.0] * len(categories)
        dictionary[word][index] = word_count

print '*** TOTAL:', len(dictionary)

result = {
    'categories': categories,
    'number_of_samples': number_of_samples,
    'number_of_words': number_of_words,
    'total_words_count': total_words_count,
    'dictionary': dictionary
}

with open('knowledge.dat', 'w') as f:
    f.write(json.dumps(result, sort_keys=True))
