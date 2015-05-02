import sys
import re
import unicodedata
from collections import Counter


NEEDED_SAMPLES = 10000

word_regex = re.compile(ur'\W+', re.UNICODE)
table = dict.fromkeys(i for i in xrange(sys.maxunicode)
                      if unicodedata.category(unichr(i)).startswith('P'))


def normalize_array_string(text):
    text = text.strip()
    if not text.startswith('['):
        text = '[' + text
    if not text.endswith(']'):
        if text.endswith(','):
            text = text[:-1] + ']'
        else:
            text = text + ']'
    return text


def maybe_warning(number):
    message = '>>>>> NEED MORE !!!'
    if number < NEEDED_SAMPLES:
        return '%s %s' % (number, message)
    else:
        return number


def remove_punctuation(s):
    return unicode(s).translate(table)


def tokenize(text):
    # text = remove_punctuation(text)
    text = text.lower()
    return word_regex.split(text)


def count_words(words, base_counter=None):
    if base_counter is None:
        wc = Counter()
    else:
        wc = base_counter
    for word in words:
        word = filter(lambda x: x.isalpha(), word)
        if len(word) >= 3:
            wc[word] += 1.0
    return wc
