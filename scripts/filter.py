import os
import sys
import json
import utils


tag = sys.argv[1]
source_file = '../data/%s.dat' % tag
destination_file = '../data/%s.dat' % tag

try:
    with open(source_file, 'r') as f:
        raw_str = utils.normalize_array_string(f.read())
except Exception:
    # print '----- %s' % source_file
    os._exit(1)

print '----- FILTERING ::: %s -----' % tag

raw_data = json.loads(raw_str)
data = {}
for e in raw_data:
    text = e['text'].strip()
    if text:
        data[e['id']] = e['text']

print 'Original: %s' % utils.maybe_warning(len(raw_data))
print 'Filtered: %s' % utils.maybe_warning(len(data))
print

output_data = [{'id': key, 'text': value}
               for key, value in data.iteritems()]

with open(destination_file, 'w') as f:
    print_str = ''.join(
        [json.dumps(e, sort_keys=True) + ',\n' for e in output_data])
    f.write(print_str)

# animals               | 10778 | ***
# architecture          | _4566 |
# art                   |       |
# cars_motorcycles      |       |
# celebrities           |       |
# diy_crafts            | 10711 | ***
# design                |       |
# education             |       |
# film_music_books      |       |
# food_drink            | 11388 | ***
# gardening             |       |
# geek                  |       |
# hair_beauty           |       |
# health_fitness        |       |
# history               |       |
# holidays_events       |       |
# home_decor            |       |
# humor                 |       |
# illustrations_posters |       |
# kids                  | 10722 | ***
# mens_fashion          |       |
# outdoors              | _5422 |
# photography           |       |
# products              |       |
# quotes                |       |
# science_nature        |       |
# sports                | _5727 |
# tattoos               |       |
# technology            |       |
# travel                | 10978 | ***
# weddings              |       |
# womens_fashion        |       |
# other                 |       |
