import universalFetch from './universalFetch';

export async function fetchPosts(attributes, options = {}) {
    const { headers = false, append = false } = options;
    
    const requestData = {
        post_type: attributes.postType || 'post',
        page: attributes.page || 1,
        post_status: attributes.postStatus || 'publish',
        posts_per_page: attributes.postsPerPage || 12,
        order: attributes.order || 'desc',
        orderby: attributes.orderBy || 'date',
        offset: attributes.offset || 0
    };

    if ( ( attributes.orderBy === 'meta_value' || attributes.orderBy === 'meta_value_num' ) && attributes.orderByMetaKey) {
        requestData.meta_key = attributes.orderByMetaKey;
    }

    if (hasMetaQuery(attributes)) {
        requestData.meta_query = attributes.metaFields
    }

    if (attributes.search) {
        requestData.search = attributes.search;
    }
    
    if (attributes.taxonomy && attributes.terms && attributes.terms.length > 0) {
        requestData.terms = {};
        requestData.terms[attributes.taxonomy] = attributes.terms;
    }

    try {
        const response = await universalFetch({
            path: 'posts-by-tabs/v1/posts',
            method: 'POST',
            data: requestData,
            returnHeaders: headers,
            attributes: attributes
        });


        if (!response) {
            return false;
        }
        
        if (headers && response.total_posts !== undefined) {
            return {
                posts: response?.posts || [],
                headers: {
                    'x-wp-total': response.total_posts.toString(),
                    'x-wp-totalpages': Math.ceil(response.total_posts / (attributes.postsPerPage || 12)).toString()
                }
            };
        }

        return response;

    } catch (error) {
        console.error('Error in fetchPosts:', error);
        return false;
    }

}

export function hasMetaQuery(attributes) {
    if(attributes?.metaFields?.fields?.length > 0) {
        if(attributes?.metaFields?.fields[0]?.key && attributes?.metaFields?.fields[0]?.value) {
            return true;
        }
        return false;
    }
    return false;
}