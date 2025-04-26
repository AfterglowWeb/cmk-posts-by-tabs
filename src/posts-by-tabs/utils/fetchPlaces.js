import universalFetch from './universalFetch';

export default async function fetchPlaces (attributes) {

    const { placePostType } = attributes?.options;

    const requestData = {
        post_type: placePostType || 'place',
        posts_per_page: 10,
        pages:1,
        order: attributes.order || 'ASC',
        orderby: 'title',
    };

    const response = await universalFetch({
        path: 'posts-by-tabs/v1/posts',
        method: 'POST',
        data: requestData,
        returnHeaders: true,
        attributes: attributes,
    });

    if (response.error) {
        console.error('Error fetching places:', response.error);
        return [];
    }

    if (!response.data) {
        console.error('No data returned from fetchPlaces');
        return [];
    }

    if (!response.data.posts) {
        console.error('No places returned from fetchPlaces');
        return [];
    }

    return response.data.posts;
    

}
