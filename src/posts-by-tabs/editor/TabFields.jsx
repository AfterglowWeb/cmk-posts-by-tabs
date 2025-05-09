import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { PanelBody } from '@wordpress/components';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import TabTemplateOptions from './TabTemplateOptions';
import MuiSelect from './MuiSelect';
import textInputStyle from '../styles/textInputStyle';

const postsByTabsSettings = window.postsByTabsSettings || {
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
            template: postsByTabsSettings.defaultTemplate,
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
                    apiKey: postsByTabsSettings.googleMapsApiKey,
                    center: {
                        lat: postsByTabsSettings.defaultLatitude,
                        lng: postsByTabsSettings.defaultLongitude
                    },
                    zoom: 13,
                    mapStyle: 'red',
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

            <label className="mb-2 flex justify-between w-full items-center">
                <IconButton aria-label={__('Drag to reorder')}>
                    <DragIndicatorIcon />
                </IconButton>
                <span className="block font-bold mb-0">{__('Onglet')} {index + 1}{ tab.title ? `: ${tab.title}` : '' }</span>
                <IconButton  
                aria-label={__('Remove tab')}
                onClick={() => handleRemoveTab(index)}
                >
                    <DeleteOutlineIcon />
                </IconButton>
            </label>

            <div className="mb-2">
                <PanelBody title={__('Titles')} initialOpen={false}>
                    <div className="pt-4">
                    <TextField
                        sx={textInputStyle}
                        placeholder={__('Title')}
                        value={ tab?.title || '' }
                        onChange={ ( event ) => {handleTabValueChange(event.target.value, 'title', index)} }
                    />
                    <TextField
                        sx={textInputStyle}
                        placeholder={__('Subtitle')}
                        value={ tab?.subtitle }
                        onChange={ ( event ) => {handleTabValueChange(event.target.value, 'subtitle', index)} }
                    />
                    <TextField
                        sx={textInputStyle}
                        placeholder={__('Data 1')}
                        value={ tab?.meta_1 }
                        onChange={ ( event ) => {handleTabValueChange(event.target.value, 'meta_1', index)} }
                    />
                    <TextField
                        sx={textInputStyle}
                        placeholder={__('Data 2')}
                        value={ tab?.meta_2 }
                        onChange={ ( event ) => {handleTabValueChange(event.target.value, 'meta_2', index)} }
                    />
                    </div>
                </PanelBody>
                <PanelBody title={__('Template options')} initialOpen={false}>
                    <div className="pt-4">
                        <MuiSelect
                            label={__('Template')}
                            value={ tab?.template || '' }
                            options={templates}
                            onChange={ ( value ) => {handleTabValueChange(value, 'template', index)} }
                        />
                        <TabTemplateOptions tab={tab} postType={attributes.postType} index={index} handleTabValueChange={handleTabValueChange} />
                    </div>
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
    startIcon={<AddIcon />}
    onClick={handleAddTab} >
        { __( 'Ajouter un onglet' ) }
    </Button>
    </>
);
}