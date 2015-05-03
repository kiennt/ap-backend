import os.path
import json

input_file = '../data/%s.dict'
output_file = '../data/KNOWLEDGE'

BASE_CATEGORIES = [
    'animals', 'architecture', 'art', 'cars_motorcycles', 'celebrities',
    'diy_crafts', 'design', 'education', 'film_music_books', 'food_drink',
    'gardening', 'geek', 'hair_beauty', 'health_fitness', 'history',
    'holidays_events', 'home_decor', 'humor', 'illustrations_posters', 'kids',
    'mens_fashion', 'outdoors', 'photography', 'products', 'quotes',
    'science_nature', 'sports', 'tattoos', 'technology', 'travel', 'weddings',
    'womens_fashion', 'other'
]

categories = []

print '----- MERGING -----'

for category in BASE_CATEGORIES:
    if os.path.isfile(input_file % category):
        categories.append(category)

print '*** Categories (%s): %s' % (len(categories), ', '.join(categories))

number_of_samples = [0] * len(categories)
number_of_words = [0] * len(categories)
total_words_count = [0] * len(categories)
dictionary = {}

for index, category in enumerate(categories):
    with open(input_file % category, 'r') as f:
        data = json.loads(f.read())
    number_of_samples[index] = data['number_of_samples']
    number_of_words[index] = data['number_of_words']
    total_words_count[index] = data['total_words_count']

    for word, word_count in data['dictionary'].iteritems():
        if word not in dictionary:
            dictionary[word] = [0.0] * len(categories)
        dictionary[word][index] = word_count

print '*** Number of Words in Dictionary: %s' % len(dictionary)
print

result = {
    'categories': categories,
    'number_of_samples': number_of_samples,
    'number_of_words': number_of_words,
    'total_words_count': total_words_count,
    'dictionary': dictionary
}

with open(output_file, 'w') as f:
    f.write(json.dumps(result, sort_keys=True))
