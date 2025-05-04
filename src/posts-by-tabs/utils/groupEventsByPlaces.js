
export default function groupEventsByPlaces(attributes, posts) {
  if (!Array.isArray(posts) || posts.length === 0) {
    return [];
  }

  const placeForeignKey = attributes?.placeForeignKey || 'lieu';
  const grouped = [];

  // Process each post/event
  posts.forEach(post => {

  let places = null;

  if (post.acf && post.acf[placeForeignKey]) {
      places = post.acf[placeForeignKey];
    } else if (post.meta && post.meta[placeForeignKey]) {
      places = post.meta[placeForeignKey];
    } else if (post[placeForeignKey]) {
      places = post[placeForeignKey];
    }

    if (!places) {
      console.log('No place data found for post:', post.id);
      return;
    }

    const placesArray = Array.isArray(places) ? places : [places];
    
    placesArray.forEach(place => {
      if (!place || !place.id) {
        console.log('Invalid place data for post:', post.id);
        return;
      }
      
      const existingIndex = grouped.findIndex(item => item.place.id === place.id);
      
      if (existingIndex !== -1) {
        grouped[existingIndex].events.push(post);
      } else {
        grouped.push({
          place: place,
          events: [post]
        });
      }
    });
  });


  return grouped;
}