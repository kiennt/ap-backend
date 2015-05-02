import json
import utils
import math

categories = None
number_of_samples = None
number_of_words = None
total_words_count = None
dictionary = None
priors = None


def init():
    global categories, dictionary, priors
    global number_of_samples, number_of_words, total_words_count

    print '***** INIT *****'
    print

    with open('../data/knowledge.dat', 'r') as f:
        data = json.loads(f.read())

    # Unpack data
    categories = data['categories']
    number_of_samples = data['number_of_samples']
    number_of_words = data['number_of_words']
    total_words_count = data['total_words_count']
    dictionary = data['dictionary']

    # Calculate priors
    total_overall_samples = sum(number_of_samples)
    priors = [math.log(float(number_of_samples[i]) / total_overall_samples)
              for i in xrange(len(categories))]


# Traditional Naive Bayes
def _probability1(entry, word_count, category):
    numerator = entry[category] + 1.0
    denominator = total_words_count[category] + number_of_words[category]
    return math.log(word_count * numerator / denominator)


# Customized Naive Bayes
def _probability2(entry, word_count, category):
    numerator = entry[category] + 1.0
    denominator = sum(entry) + len(categories)
    return word_count * math.log(numerator / denominator)


def classify(text):
    if not dictionary:
        init()

    print '----- Classifying -----'
    print text
    print

    results = priors[:]
    # results = [0.0] * len(categories)
    counter = utils.count_words(utils.tokenize(text))

    for word, count in counter.iteritems():
        entry = dictionary.get(word)
        if entry:
            for cat in xrange(len(categories)):
                results[cat] += _probability2(entry, count, cat)

    # DEBUG
    s_cat = sorted(xrange(len(categories)),
                   key=lambda x: results[x], reverse=True)
    print '----- RESULT -----'
    for i in s_cat:
        print '%s: %.4f' % (categories[i].ljust(15), results[i])
