import sys
import json

tag = sys.argv[1]
source_file = '%s.dat' % tag


print '*** FILTERING ***', tag

with open(source_file, 'r') as f:
    raw_str = f.read()

raw_data = json.loads(raw_str)
data = {}
for e in raw_data:
    text = e['text'].strip()
    if text:
        data[e['id']] = e['text']

print 'Original:', len(raw_data)
print 'Filtered:', len(data)

output_data = [{'id': key, 'text': value}
               for key, value in data.iteritems()]

with open(source_file, 'w') as f:
    f.write(json.dumps(output_data, sort_keys=True, indent=2))

# --- animals --- 10778
# --- food_drink --- 11388
# --- travel --- 10978
# --- kids --- 10722
# --- sports
# --- outdoors
# --- diy_crafts
# --- architecture
# art
# cars_motorcycles
# celebrities
# design
# education
# film_music_books
# gardening
# geek
# hair_beauty
# health_fitness
# history
# holidays_events
# home_decor
# humor
# illustrations_posters
# mens_fashion
# photography
# products
# quotes
# science_nature
# tattoos
# technology
# weddings
# womens_fashion
# other
