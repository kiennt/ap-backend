import _ from 'lodash';


const CATEGORY_NAMES = {
  'animals': ['Animals & Pets'],
  'architecture': ['Architecture'],
  'art': ['Art'],
  'cars_motorcycles': ['Cars & Motorcycles'],
  'celebrities': ['Celebrities'],
  'diy_crafts': ['DIY & Crafts'],
  'design': ['Design'],
  'education': ['Education'],
  'film_music_books': ['Film, Music & Books'],
  'food_drink': ['Food & Drink'],
  'gardening': ['Gardening'],
  'geek': ['Geek'],
  'hair_beauty': ['Hair & Beauty'],
  'health_fitness': ['Health & Fitness'],
  'history': ['History'],
  'holidays_events': ['Holidays & Events'],
  'home_decor': ['Home Decor'],
  'humor': ['Humor'],
  'illustrations_posters': ['Illustrations & Posters'],
  'kids': ['Kids & Parenting'],
  'mens_fashion': ['Men\'s Fashion'],
  'outdoors': ['Outdoors'],
  'photography': ['Photography'],
  'products': ['Products'],
  'quotes': ['Quotes'],
  'science_nature': ['Science & Nature'],
  'sports': ['Sports'],
  'tattoos': ['Tattoos'],
  'technology': ['Technology'],
  'travel': ['Travel'],
  'weddings': ['Weddings'],
  'womens_fashion': ['Women\'s Fashion'],
  'other': ['Other']
};

function getCategoryName(categoryKey) {
  categoryKey = categoryKey || '';
  let names = CATEGORY_NAMES[categoryKey.toLowerCase()];
  return names ? _.sample(names) : undefined;
}

function getCategoryKey(categoryName) {
  categoryName = _.normalizedString(categoryName);
  return _(CATEGORY_NAMES).findKey((names) => {
    return _(names).some((name) => {
      return categoryName === _.normalizedString(name);
    });
  });
}

export default {
  getCategoryKey,
  getCategoryName
};
