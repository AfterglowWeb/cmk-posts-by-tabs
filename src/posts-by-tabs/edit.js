import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';

import QueryFields from './editor/QueryFields';
import TabFields from './editor/TabFields';
import BackgroundFields from './editor/BackgroundFields';

import PostsByTabs from './front/PostsByTabs';

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

    }, [attributes.blockId, setAttributes]);
	

    const handleTabValueChange = ( value, key, index ) => {
        const tabs = [ ...attributes.tabs ];
        tabs[ index ][key] = value;
        setAttributes( { tabs } );
    };

	
	return (
		<>
			<InspectorControls>
				
				<PanelBody title={__('Block title')} initialOpen={true}>
					<TextControl
						placeholder="Title"
						value={attributes.title || ''}
						onChange={(value) => setAttributes({ title: value })}
					/>
					<TextControl
						placeholder="Subtitle"
						value={attributes.subtitle || ''}
						onChange={(value) => setAttributes({ subtitle: value })}
					/>
				</PanelBody>
				
				<PanelBody title={__('Query settings')} initialOpen={false}>
					<QueryFields attributes={attributes} setAttributes={setAttributes} />
				</PanelBody>

				<PanelBody title={__('Tabs')} initialOpen={false}>
					<TabFields attributes={attributes} setAttributes={setAttributes} handleTabValueChange={handleTabValueChange} templates={templates}  />
				</PanelBody>

				<PanelBody title={__('Block background')} initialOpen={false}>
					<BackgroundFields attributes={attributes} setAttributes={setAttributes} />
				</PanelBody>
			</InspectorControls>
			
			<PostsByTabs 
			templates={templates}
			attributes={attributes} 
			setAttributes={setAttributes} 
			handleTabValueChange={handleTabValueChange} 
			clientId={clientId} 
			/>

		</>

	);
	
}