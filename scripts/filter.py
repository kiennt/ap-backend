import os
import sys
import json
import utils


target = [
    'art', 'cars_motorcycles', 'celebrities', 'design',
    'education', 'film_music_books', 'gardening', 'geek'
]

tag = sys.argv[1]
source_file = '../data/%s.dat' % tag
destination_file = '../data/%s.dat' % tag


if target and tag not in target:
    os._exit(1)

try:
    with open(source_file, 'r') as f:
        raw_str = utils.normalize_array_string(f.read())
except Exception:
    # print '----- %s' % source_file
    os._exit(1)

raw_data = json.loads(raw_str)
data = {}
for e in raw_data:
    text = e['text'].strip()
    if text:
        data[e['id']] = e['text']

print '----- FILTERING ::: %s -----' % tag
print 'Original: %s' % utils.maybe_warning(len(raw_data))
print 'Filtered: %s' % utils.maybe_warning(len(data))
print

output_data = [{'id': key, 'text': value}
               for key, value in data.iteritems()]

with open(destination_file, 'w') as f:
    print_str = ''.join(
        [json.dumps(e, sort_keys=True) + ',\n' for e in output_data])
    f.write(print_str)

# animals               | 12108 | ***
# architecture          | 11886 | ***
# art                   |       |
# cars_motorcycles      |       |
# celebrities           |       |
# diy_crafts            | 11984 | ***
# design                |       |
# education             |       |
# film_music_books      |       |
# food_drink            | 12805 | ***
# gardening             |       |
# geek                  |       |
# hair_beauty           | 11757 | ***
# health_fitness        |       |
# history               |       |
# holidays_events       |       |
# home_decor            |       |
# humor                 |       |
# illustrations_posters |       |
# kids                  | 11936 | ***
# mens_fashion          |       |
# outdoors              | 11038 | ***
# photography           |       |
# products              |       |
# quotes                |       |
# science_nature        |       |
# sports                | 12214 | ***
# tattoos               |       |
# technology            |       |
# travel                | 11780 | ***
# weddings              |       |
# womens_fashion        |       |
# other                 |       |
