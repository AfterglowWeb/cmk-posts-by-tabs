import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Spinner } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';

import universalFetch from './utils/universalFetch';

import QueryFields from './editor/QueryFields';
import TabFields from './editor/TabFields';
import EditorFilterFields from './editor/FilterFields';

import PostsByTabs from './front/PostsByTabs';
import {APIProvider} from './front/GoogleMapsProvider';

export default function Edit({attributes, setAttributes}) {
	
	const [postsByTabsSettings, setPostsByTabsSettings] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
    const [selectedPostType, setSelectedPostType] = useState(attributes.postType || 'post');
    const [selectedOrderByMetaKey, setSelectedOrderByMetaKey] = useState(attributes.orderByMetaKey || '');
    const [taxonomyTerms, setTaxonomyTerms] = useState(attributes.taxonomyTerms || {});
	const templates = [
		{
			label: __('Posts Grid'),
			value: 'grid',
		},
		{
			label: __('Posts Slider'),
			value: 'slider',
		},
		{
			label: __('Posts Row'),
			value: 'row',
		},
		{
			label: __('Posts Map (events)'),
			value: 'map',
		},
		{
			label: __('Posts Calendar (events)'),
			value: 'calendar',
		}
	];

    const handleTabValueChange = ( value, key, index ) => {
        const tabs = [ ...attributes.tabs ];
        tabs[ index ][key] = value;
        setAttributes( { tabs } );
    };
    
    const fetchPostsByTabsSettings = async () => {
        try {
			const response = await universalFetch({
					path: 'posts-by-tabs/v1/settings',
					method: 'GET',
					returnHeaders: false,
					attributes: attributes
				});

            if (!response.error) {
                setPostsByTabsSettings(response);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

	const updateQueryAttributes = (newAttributes) => {
        setAttributes({...attributes, ...newAttributes});
        
        if (newAttributes.postType !== undefined) {
            setSelectedPostType(newAttributes.postType);
        }
        
        if (newAttributes.orderByMetaKey !== undefined) {
            setSelectedOrderByMetaKey(newAttributes.orderByMetaKey);
        }
        
        if (newAttributes.taxonomyTerms !== undefined) {
            setTaxonomyTerms(newAttributes.taxonomyTerms);
        }
    };
    
    const queryFieldProps = {
        attributes,
        setAttributes,
        postsByTabsSettings,
        selectedPostType,
        setSelectedPostType,
        selectedOrderByMetaKey,
        setSelectedOrderByMetaKey,
        taxonomyTerms,
        setTaxonomyTerms,
        updateQueryAttributes
    };
    
    const filterFieldProps = {
        attributes,
        setAttributes,
        postsByTabsSettings,
        selectedPostType,
        setSelectedPostType,
        taxonomyTerms,
        setTaxonomyTerms,
        updateQueryAttributes
    };

	useEffect(() => {
        fetchPostsByTabsSettings();
    }, []);


	useEffect(() => {
		// Don't return early, use a conditional block instead
		if (postsByTabsSettings) {
			if (!attributes.blockId) {
				setAttributes({ blockId: crypto.randomUUID() });
			}
	
			if (!attributes.initialized && postsByTabsSettings.options) {
				setAttributes({ 
					initialized: true,
					postsPerPage: postsByTabsSettings.options.postsPerPage,
					postType: attributes.postType ?  attributes.postType : 'post',
					orderByMetaKey: attributes.orderByMetaKey ? attributes.orderByMetaKey : '',
					tabs: attributes.tabs?.length ? attributes.tabs : [{
						template: postsByTabsSettings.options.defaultTemplate,
						options: {
							map: {
								apiKey: postsByTabsSettings.options.googleMapsApiKey,
								center: {
									lat: postsByTabsSettings.options.defaultLatitude,
									lng: postsByTabsSettings.options.defaultLongitude
								},
								zoom: 13
							}
						}
					}]
				});
			}
		}
	}, [setAttributes, attributes.blockId, attributes.initialized, attributes.tabs, attributes.postType, attributes.orderByMetaKey, postsByTabsSettings]);

	if (isLoading) {
        return <Spinner />;
    }
	
	return (
		<>
			<InspectorControls>

		
				<QueryFields {...queryFieldProps} />
	

				<PanelBody title={__('Tabs')} initialOpen={false}>
					<TabFields 
					attributes={attributes} 
					setAttributes={setAttributes} 
					handleTabValueChange={handleTabValueChange} 
					templates={templates}  
					postsByTabsSettings={postsByTabsSettings?.options}
					/>
				</PanelBody>

				<EditorFilterFields {...filterFieldProps} />

			</InspectorControls>
			
			<APIProvider 
            apiKey={postsByTabsSettings?.googleMapsApiKey}
            libraries={['places', 'marker']}
            >
				<PostsByTabs 
				templates={templates}
				attributes={attributes} 
				setAttributes={setAttributes} 
				isEditor={true}
				useBlockProps={useBlockProps}
				postsByTabsSettings={postsByTabsSettings?.options}
				/>
			</APIProvider>

		</>

	);
	
}