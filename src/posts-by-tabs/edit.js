import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useEffect } from '@wordpress/element';

import QueryFields from './editor/QueryFields';
import TabFields from './editor/TabFields';

import PostsByTabs from './front/PostsByTabs';

const pluginSettings = window.postsByTabsSettings || {
    dateFormat: 'Y-m-d',
    googleMapsApiKey: '',
    defaultLatitude: 48.8566,
    defaultLongitude: 2.3522,
    postsPerPage: 10,
    defaultTemplate: 'grid',
    cacheDuration: 3600
};

export default function Edit({attributes, setAttributes, clientId}) {

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

		if (!attributes.blockId) {
			setAttributes({ blockId: crypto.randomUUID() });
		}

		if (!attributes.initialized) {
            setAttributes({ 
                initialized: true,
                numberOfItems: pluginSettings.postsPerPage,
                tabs: attributes.tabs?.length ? attributes.tabs : [{
                    template: pluginSettings.defaultTemplate,
                    options: {
                        map: {
                            apiKey: pluginSettings.googleMapsApiKey,
                            center: {
                                lat: pluginSettings.defaultLatitude,
                                lng: pluginSettings.defaultLongitude
                            },
                            zoom: 13
                        }
                    }
                }]
            });
        }

    }, [attributes.blockId, attributes.initialized, setAttributes]);
	

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
					defaultPostsPerPage={pluginSettings.postsPerPage}
					/>
				</PanelBody>

				<PanelBody title={__('Tabs')} initialOpen={false}>
					<TabFields 
					attributes={attributes} 
					setAttributes={setAttributes} 
					handleTabValueChange={handleTabValueChange} 
					templates={templates}  
					pluginSettings={pluginSettings}
					/>
				</PanelBody>

			</InspectorControls>
			
			<PostsByTabs 
			templates={templates}
			attributes={attributes} 
			setAttributes={setAttributes} 
			isEditor={true}
			pluginSettings={pluginSettings}
			/>

		</>

	);
	
}