import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';

import Editor from './editor/Editor';
import QueryFields from './editor/QueryFields';
import TabFields from './editor/TabFields';
import Background from './editor/Background';

export default function Edit({attributes, setAttributes, clientId}) {

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
				
				<PanelBody title={__('Titre du bloc')} initialOpen={true}>
					<TextControl
						placeholder="Titre"
						value={attributes.title || ''}
						onChange={(value) => setAttributes({ title: value })}
					/>
					<TextControl
						placeholder="Sous-titre"
						value={attributes.subtitle || ''}
						onChange={(value) => setAttributes({ subtitle: value })}
					/>
				</PanelBody>
				
				<PanelBody title={__('Posts')} initialOpen={false}>
					<QueryFields attributes={attributes} setAttributes={setAttributes} />
				</PanelBody>

				<PanelBody title={ __( 'Onglets' ) }>
					<TabFields attributes={attributes} setAttributes={setAttributes} />
				</PanelBody>

				<PanelBody title={__('Fond du bloc')} initialOpen={false}>
					<Background attributes={attributes} setAttributes={setAttributes} />
				</PanelBody>
			</InspectorControls>
			
			<Editor attributes={attributes} setAttributes={setAttributes} handleTabValueChange={handleTabValueChange} clientId={clientId} />

		</>

	);
	
}