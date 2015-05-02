# coding=utf-8

import sys
import json
import utils
from collections import Counter


tag = sys.argv[1]
source_file = '%s.dat' % tag
destination_file = '%s.dict' % tag

with open(source_file, 'r') as f:
    raw_str = f.read()
data = json.loads(raw_str)

print 'Number of tests:', len(data)


counter = Counter()
for e in data:
    utils.count_words(utils.tokenize(e['text']), counter)

total_word_counts = sum(counter.values())

result = {
    'number_of_samples': len(data),
    'total_words_count': sum(counter.itervalues()),
    'number_of_words': len(counter),
    'dictionary': counter
}

with open(destination_file, 'w') as f:
    f.write(json.dumps(result, sort_keys=True, indent=2))
