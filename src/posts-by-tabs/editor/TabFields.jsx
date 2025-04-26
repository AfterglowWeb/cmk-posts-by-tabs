import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { TextControl, PanelBody } from '@wordpress/components';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TabTemplateOptions from './TabTemplateOptions';
import MuiSelect from './MuiSelect';

const pluginSettings = window.postsByTabsSettings || {
    googleMapsApiKey: '',
    defaultLatitude: 48.8566,
    defaultLongitude: 2.3522,
    defaultTemplate: 'grid'
};

export default function TabFields(props) {
    
    const { attributes, setAttributes, handleTabValueChange, templates } = props;
    const { tabs } = attributes;

    useEffect(() => {
        if (!attributes.tabs || !Array.isArray(attributes.tabs)) {
            setAttributes({ tabs: [] });
        }
    }, [attributes.tabs, setAttributes]);
    
    const handleAddTab = () => {
        const tabs = [ ...attributes.tabs || [] ];
        tabs.push( {
            template: pluginSettings.defaultTemplate,
            title: '',
            subtitle: '',
            meta_1: '',
            meta_2: '',
            content: '',
            options: {
                grid:{
                    free_flow: false,
                    cols_desktop: 3,
                    cols_tablet: 2,
                    cols_mobile: 1,
                    gap_desktop: 0,
                    gap_tablet: 0,
                    gap_mobile: 0
                },
                row:{
                    infinite_scroll: false,
                    free_flow: false,
                    cols_desktop: 3,
                    cols_tablet: 2,
                    cols_mobile: 1,
                    gap_desktop: 0,
                    gap_tablet: 0,
                    gap_mobile: 0
                },
                calendar:{
                    start_key: 'start',
                    end_key: 'end',
                    default_view: 'week',
                    show_days: false,
                    show_weeks: false,
                    show_months: true,
                },
                map:{
                    apiKey: pluginSettings.googleMapsApiKey,
                    center: {
                        lat: pluginSettings.defaultLatitude,
                        lng: pluginSettings.defaultLongitude
                    },
                    zoom: 13
                },
                slider:{
                    slidesPerView: 1,
                    spaceBetween: 0,
                    effect: 'slide',
                    autoplay: false,
                    delay: 3000,
                    speed: 500,
                    loop: false,
                    hideScrollBar: false,
                    hideNavigation: false,
                    hidePagination: false,
                }
            },
        } );
        setAttributes( { tabs } );
    };

    const handleRemoveTab = ( index ) => {
        const tabs = [ ...attributes.tabs ];
        tabs.splice( index, 1 );
        setAttributes( { tabs } );
    };


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
                <PanelBody title={__('Titles')} initialOpen={false}>
                    <TextControl
                        placeholder={__('Title')}
                        value={ tab?.title || '' }
                        onChange={ ( value ) => {handleTabValueChange(value, 'title', index)} }
                    />
                    <TextControl
                        placeholder={__('Subtitle')}
                        value={ tab?.subtitle }
                        onChange={ ( value ) => {handleTabValueChange(value, 'subtitle', index)} }
                    />
                    <TextControl
                        placeholder={__('Data 1')}
                        value={ tab?.meta_1 }
                        onChange={ ( value ) => {handleTabValueChange(value, 'meta_1', index)} }
                    />
                    <TextControl
                        placeholder={__('Data 2')}
                        value={ tab?.meta_2 }
                        onChange={ ( value ) => {handleTabValueChange(value, 'meta_2', index)} }
                    />
                </PanelBody>
                <PanelBody title={__('Template options')} initialOpen={false}>
                    <MuiSelect
                        label={__('Template')}
                        value={ tab?.template || '' }
                        options={templates}
                        onChange={ ( value ) => {handleTabValueChange(value, 'template', index)} }
                    />
                    <TabTemplateOptions tab={tab} postType={attributes.postType} index={index} handleTabValueChange={handleTabValueChange} />
                </PanelBody>
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