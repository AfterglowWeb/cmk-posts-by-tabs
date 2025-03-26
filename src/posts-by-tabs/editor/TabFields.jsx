import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { SelectControl, TextControl, PanelBody, CheckboxControl } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

export default function TabFields(props) {
    
    const { attributes, setAttributes, handleTabValueChange } = props;
    const { tabs } = attributes;
    const templates = [
		{
			label: __('Posts Grid'),
			value: 'posts-grid',
		},
		{
			label: __('Posts Slider'),
			value: 'posts-slider',
		},
		{
			label: __('Posts Grid Simple Row'),
			value: 'posts-grid',
		},
		{
			label: __('Posts Map (events)'),
			value: 'events-map',
		},
		{
			label: __('Posts Calendar (events)'),
			value: 'events-calendar',
		}
	];

    useEffect(() => {
        if (!attributes.tabs || !Array.isArray(attributes.tabs)) {
            setAttributes({ tabs: [] });
        }
    }, [attributes.tabs, setAttributes]);
    
    const handleAddTab = () => {
        const tabs = [ ...attributes.tabs || [] ];
        tabs.push( {
            template:'',
            title: '',
            subtitle: '',
            meta_1: '',
            meta_2: '',
            content: '',
            mediaId: 0,
            mediaUrl: '',
            mediaType: '',
            mediaAlt: '',
        } );
        setAttributes( { tabs } );
    };

    const handleRemoveTab = ( index ) => {
        const tabs = [ ...attributes.tabs ];
        tabs.splice( index, 1 );
        setAttributes( { tabs } );
    };

    const removeTabMedia = ( index ) => {
        const tabs = [ ...attributes.tabs ];
        tabs[ index ].mediaId = 0;
        tabs[ index ].mediaUrl = '';
        tabs[ index ].mediaType = '';
        tabs[ index ].mediaAlt = '';
        setAttributes( { tabs } );
    }

    const onSelectTabMedia = (media , index) => {
        const tabs = [ ...attributes.tabs ];
        tabs[ index ].mediaId = media.id;
        tabs[ index ].mediaUrl =  media.url;
        tabs[ index ].mediaType = media.type;
        tabs[ index ].mediaAlt = media.alt;
        setAttributes( { tabs } );
    }

    return (
    <>
    {tabs && tabs.map( ( tab, index ) => {
        return (
        <Paper key={ index } className="p-2 mb-4" elevation={3}>
            <div className="mb-2 flex justify-between">
                <h3 className="lowercase">{__('Onglet')} {index + 1}</h3>
                <Button 
                variant="outlined" 
                size="small" 
                color="secondary"
                sx={{textTransform:"none"}} 
                onClick={() => handleRemoveTab(index)} >
                    { __( 'Supprimer' ) }
                </Button>
            </div>
            <div className="mb-2">
                <PanelBody title={__('Textes')} initialOpen={true}>
                    <SelectControl
                        label="Template"
                        value={ tab?.template || '' }
                        options={templates}
                        onChange={ ( value ) => {handleTabValueChange(value, 'template', index)} }
                    />
                    <TextControl
                        placeholder="Titre"
                        value={ tab?.title || '' }
                        onChange={ ( value ) => {handleTabValueChange(value, 'title', index)} }
                    />
                    <TextControl
                        placeholder="Sous-titre"
                        value={ tab?.subtitle }
                        onChange={ ( value ) => {handleTabValueChange(value, 'subtitle', index)} }
                    />
                    <TextControl
                        placeholder="Donnée 1"
                        value={ tab?.meta_1 }
                        onChange={ ( value ) => {handleTabValueChange(value, 'meta_1', index)} }
                    />
                    <TextControl
                        placeholder="Donnée 2"
                        value={ tab?.meta_2 }
                        onChange={ ( value ) => {handleTabValueChange(value, 'meta_2', index)} }
                    />
                </PanelBody>
            </div>
            <div className="mb-2">
                <PanelBody title={__('Image')} initialOpen={false}>
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={ ( media ) => {onSelectTabMedia(media, index)} }
                            allowedTypes={ ['image'] }
                            value={ tab?.mediaId }
                            render={ ( { open } ) => (
                                <Button color="secondary" className="mb-2 bg-slate-50 aspect-video" onClick={ open }>
                                    {tab?.mediaUrl ? 
                                        <img src={tab?.mediaUrl} alt={tab?.title || ''} className="w-full h-full object-cover"/>
                                        :
                                        __('Sélectionner une image')
                                    }
                                </Button>
                            ) }
                        />
                    </MediaUploadCheck>
                    {tab?.mediaId != 0 && 
                    <div className="mt-2">
                        <MediaUploadCheck>
                            <Button 
                            color="secondary"
                            variant="outlined" 
                            size="small" 
                            sx={{textTransform:"none"}} 
                            onClick={() => {removeTabMedia(index)}}>{__('Supprimer l\'image')}</Button>
                        </MediaUploadCheck>
                    </div>
                    }
                </PanelBody>
            </div>
            <div className="mb-2">	
            </div>
        </Paper>
        )
    })}
    <Button 
    variant="contained" 
    size="small" 
    color="secondary"
    sx={{textTransform:"none"}}
    onClick={handleAddTab} >
        { __( 'Ajouter un onglet' ) }
    </Button>
    </>
);
}