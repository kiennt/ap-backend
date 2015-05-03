import os
import sys
import json
import utils
from collections import Counter


tag = sys.argv[1]
source_file = '../data/%s.dat' % tag
destination_file = '../data/%s.dict' % tag

try:
    with open(source_file, 'r') as f:
        raw_str = utils.normalize_array_string(f.read())
except Exception:
    # print '----- %s' % source_file
    os._exit(1)

print '----- COUNTING ::: %s -----' % tag

data = json.loads(raw_str)

print 'Number of Samples: %s' % utils.maybe_warning(len(data))

counter = Counter()
for e in data:
    utils.count_words(utils.tokenize(e['text']), counter)

print 'Number of Words: %s' % len(counter)
print

total_word_counts = sum(counter.values())

result = {
    'number_of_samples': len(data),
    'total_words_count': sum(counter.itervalues()),
    'number_of_words': len(counter),
    'dictionary': counter
}

with open(destination_file, 'w') as f:
    f.write(json.dumps(result, sort_keys=True, indent=2))
