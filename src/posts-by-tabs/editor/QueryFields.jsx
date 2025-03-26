import { __ } from '@wordpress/i18n';
import { 
	QueryControls
} from '@wordpress/components';
import { 
	useState, 
    useEffect
} from '@wordpress/element';

export default function QueryFields({attributes, setAttributes}) {
    const { maxItems, minItems, numberOfItems, order, orderBy, category } = attributes;
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        
        if (!attributes.posts || !Array.isArray(attributes.posts)) {
            setAttributes({ posts: [] });
        }

        wp.apiFetch({ path: '/wp/v2/categories' }).then((categories) => {
            setCategories(categories);
        });
    }
    , []);

    const updateQuery = (newAttributes) => {
        setAttributes(newAttributes);
    }

    return (
        <QueryControls
            { ...{ maxItems, minItems, numberOfItems, order, orderBy } }
            onOrderByChange={ ( newOrderBy ) => updateQuery( { orderBy: newOrderBy } ) }
            onOrderChange={ ( newOrder ) => updateQuery( { order: newOrder } ) }
            categoriesList={ categories }
            selectedCategoryId={ category }
            onCategoryChange={ ( newCategory ) => updateQuery( { category: newCategory } ) }
            onNumberOfItemsChange={ ( newNumberOfItems ) =>
                updateQuery( { numberOfItems: newNumberOfItems } )
            }
        />
    );
}