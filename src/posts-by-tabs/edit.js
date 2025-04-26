import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';

import QueryFields from './editor/QueryFields';
import TabFields from './editor/TabFields';
import MapStyleSelector from './editor/MapStyleSelector';

import PostsByTabs from './front/PostsByTabs';
import {APIProvider} from './front/GoogleMapsProvider';

export default function Edit({attributes, setAttributes}) {

	const [pluginSettings, setPluginSettings] = useState({
        dateFormat: 'd/m/Y',
        googleMapsApiKey: '',
        defaultLatitude: 48.8566,
        defaultLongitude: 2.3522,
        postsPerPage: 10,
        defaultTemplate: 'grid',
        cacheDuration: 3600
    });

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
        // Check if the global object exists
        if (typeof window !== 'undefined' && window.postsByTabsSettings) {
            const savedSettings = window.postsByTabsSettings?.options || {};
            setPluginSettings(prevSettings => ({
                ...prevSettings,
                ...savedSettings
            }));
            console.log('Plugin settings loaded:', window.postsByTabsSettings);
        } else {
            console.warn('postsByTabsSettings not found in global scope');
        }
    }, []);

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

    }, [attributes.blockId, attributes.initialized, pluginSettings, setAttributes]);
	

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
			
			<APIProvider 
            apiKey={pluginSettings?.googleMapsApiKey}
            libraries={['places', 'marker']}
            >
				<PostsByTabs 
				templates={templates}
				attributes={attributes} 
				setAttributes={setAttributes} 
				isEditor={true}
				pluginSettings={pluginSettings}
				/>
			</APIProvider>

		</>

	);
	
}