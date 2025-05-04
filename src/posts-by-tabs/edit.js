import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

import { PanelBody } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';

import QueryFields from './editor/QueryFields';
import TabFields from './editor/TabFields';

import PostsByTabs from './front/PostsByTabs';
import {APIProvider} from './front/GoogleMapsProvider';

export default function Edit({attributes, setAttributes}) {
	
	const [postsByTabsSettings, setpostsByTabsSettings] = useState(null);

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

	useEffect(() => {
        if (typeof window !== 'undefined' && window.postsByTabsSettings) {
			setpostsByTabsSettings(window.postsByTabsSettings);
            console.log('Plugin settings loaded:', window.postsByTabsSettings);
        } else {
            console.warn('postsByTabsSettings not found in global scope');
        }
    }, []);

	useEffect(() => {

		if (!postsByTabsSettings) return;

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

    }, [setAttributes, 
		attributes,
		postsByTabsSettings
	]);
	

    const handleTabValueChange = ( value, key, index ) => {
        const tabs = [ ...attributes.tabs ];
        tabs[ index ][key] = value;
        setAttributes( { tabs } );
    };
	
	return (
		<>
			<InspectorControls>

				<PanelBody title={__('Query settings')} initialOpen={false}>
					<QueryFields 
					attributes={attributes} 
					setAttributes={setAttributes} 
					postsByTabsSettings={postsByTabsSettings?.options}
					/>
				</PanelBody>

				<PanelBody title={__('Tabs')} initialOpen={false}>
					<TabFields 
					attributes={attributes} 
					setAttributes={setAttributes} 
					handleTabValueChange={handleTabValueChange} 
					templates={templates}  
					postsByTabsSettings={postsByTabsSettings?.options}
					/>
				</PanelBody>

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