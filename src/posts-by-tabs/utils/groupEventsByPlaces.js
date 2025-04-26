import fetchPlaces from './fetchPlaces';

export default function groupEventsByPlaces(attributes, posts) {
  if (!Array.isArray(posts) || posts.length === 0) {
    return [];
  }

  const placeForeignKey = attributes?.placeForeignKey || 'places';

  const grouped = fetchPlaces(attributes);

  posts.forEach(post => {
    const placeIds = getPlaceIdsFromPost(post, placeForeignKey);

    if (!Array.isArray(placeIds) || placeIds.length === 0) {
      return;
    }

    placeIds.forEach(placeId => {
      if (grouped[placeId]) {
          grouped[placeId].events = grouped[placeId].events || [];
          grouped[placeId].events.push(post);
      }

    });
  });

  return Object.values(grouped);
}
  
export function getPlaceIdsFromPost(post, placeForeignKey) {
  let places;

  if(! placeForeignKey) {
    return null;
  }

  if(post.meta) {
    if(post.meta[placeForeignKey]) {
      places = post.meta[placeForeignKey];
    }
  } 
  
  if (!places && post.acf) {
    if ( post.acf[placeForeignKey]) {
      places = post.acf[placeForeignKey];
    }
  }

  if (typeof places === 'string') {
    places = places.split(',');
  }

  if (!places) {
    return null;
  }

  if (!Array.isArray(places)) {
    return null;
  }

  const placeIds = places.map(place => {
    if (typeof place === 'object' && place !== null) {
      return parseInt(place.id, 10);
    }
    if (!isNaN(parseInt(place, 10))) {
      return parseInt(place, 10);
    }
    return null;
  });

  return [...new Set(placeIds.filter(id => id !== null))];
}