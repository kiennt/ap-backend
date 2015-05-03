import json
import utils
import math
from collections import Counter


input_file = '../data/KNOWLEDGE'
algorithms = [
    '',
    'Traditional Naive Bayes without calculating P(word)',
    'Complete Traditional Naive Bayes',
    'Customized Naive Bayes'
]


categories = None
number_of_samples = None
number_of_words = None
total_words_count = None
dictionary = None
priors = None

DEBUG = False


def init():
    global categories, dictionary, priors
    global number_of_samples, number_of_words, total_words_count

    print '***** INIT *****'
    print

    with open(input_file, 'r') as f:
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


# Naive Bayes without calculating p_word
def _probability1(entry, word_count, category):
    numerator = entry[category] + 1.0
    denominator = total_words_count[category] + number_of_words[category]
    return math.log(word_count * numerator / denominator)


# Full Traditional Naive Bayes
def _probability2(entry, word_count, category):
    numerator = entry[category]
    denominator = total_words_count[category]
    p_given = numerator / denominator
    if p_given > 0:
        p_word = sum(entry) / sum(total_words_count)
        return math.log(word_count * p_given / p_word)
    else:
        return 0


# Customized Naive Bayes
def _probability3(entry, word_count, category):
    numerator = entry[category] + 1.0
    denominator = sum(entry) + len(categories)
    return word_count * math.log(numerator / denominator)


def classify(text, algo=None):
    if not dictionary:
        init()

    algo = algo or 1
    if algo == 1:
        prob = _probability1
    elif algo == 2:
        prob = _probability2
    else:
        prob = _probability3

    if DEBUG:
        print '----- Algorithm: %s (%s) -----' % (algorithms[algo], algo)
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
                results[cat] += prob(entry, count, cat)

    s_cat = sorted(xrange(len(categories)),
                   key=lambda x: results[x], reverse=True)
    if DEBUG:
        print '----- RESULT -----'
        for i in s_cat:
            print '%s: %.4f' % (categories[i].ljust(15), results[i])
    return [categories[i] for i in s_cat]


def single(category, algo=None):
    print '--- Algorithm: %s (%s)' % (algorithms[algo], algo)
    print '--- Category: %s' % category
    with open('../data/%s.dat' % category, 'r') as f:
        raw_str = utils.normalize_array_string(f.read())
    data = json.loads(raw_str)
    print '- Number of Samples: %s' % len(data)
    counter = Counter()
    for e in data:
        res = classify(e['text'], algo)
        counter[res.index(category)] += 1
    print '- Success rate: %.4f' % (
        float(counter[0]) / sum(counter.values()) * 100)
    print '- Details:', counter


def multiple(categories, algo=None):
    total_samples = 0
    total_correct = 0

    print '--- Algorithm: %s (%s)' % (algorithms[algo], algo)
    print '--- Categories (%s): %s' % (len(categories), ', '.join(categories))

    for category in categories:
        with open('../data/%s.dat' % category, 'r') as f:
            raw_str = utils.normalize_array_string(f.read())
        data = json.loads(raw_str)
        total_samples += len(data)
        for e in data:
            res = classify(e['text'], algo)
            if res[0] == category:
                total_correct += 1

    print '- Number of Samples: %s' % total_samples
    print '- Number of Correct: %s' % total_correct
    print '- Success rate: %.4f' % (
        float(total_correct) / total_samples * 100)
