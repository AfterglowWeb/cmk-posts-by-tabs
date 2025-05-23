import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import Button from '@mui/material/Button';
import MetaField from './MetaField';
import MuiSelect from './MuiSelect';
import { PanelBody } from '@wordpress/components';

const relations = [
    {
        label: __('And'),
        value: 'AND',
    },
    {
        label: __('Or'),
        value: 'OR',
    },
];

export default function MetaFields(props) {
    
    const { attributes, updateAttributes, postsByTabsSettings } = props;

    useEffect(() => {
        if (attributes.metaFields === undefined ||
            typeof attributes.metaFields !== 'object' || 
            !attributes.metaFields.fields ||
            !Array.isArray(attributes.metaFields.fields)) {
            
            updateAttributes({
                metaFields: {
                    'relation': 'AND',
                    'fields': []
                }
            });
        }
    }, []);

    const handleRelationChange = (value) => {
        const updatedMetaFields = {
            ...attributes.metaFields,
            relation: value
        };
        updateAttributes({ metaFields: updatedMetaFields });
    };
    
    const handleAddMetaField = () => {
        const updatedMetaFields = {
            ...attributes.metaFields,
            fields: [
                ...(attributes.metaFields?.fields || []),
                {
                    key: '',
                    value: '',
                    compare: '=',
                    type: 'CHAR',
                    isUserValue: false,
                    isDateToday: false,
                }
            ]
        };
        updateAttributes({ metaFields: updatedMetaFields });
    };

    return (
    <PanelBody title={__('Meta Query Settings')} initialOpen={false}>
        <div className="py-2" />
        <MuiSelect
            label={__('Relation')}
            value={attributes.metaFields.relation || 'AND'}
            options={relations}
            onChange={(value) => handleRelationChange(value)}
        />
        {Array.isArray(attributes.metaFields.fields) && attributes.metaFields.fields.map( ( metaField, index ) => {
            return (
            <MetaField key={index} attributes={attributes} updateAttributes={updateAttributes} metaField={metaField} index={index} postsByTabsSettings={postsByTabsSettings} />
            )
        })}
        <div className="flex gap-4 py-2">
            <Button 
            variant="contained" 
            size="small" 
            color="secondary"
            sx={{textTransform:"none"}}
            onClick={handleAddMetaField} >
                { __( 'Add a meta query' ) }
            </Button>
        </div>
    </PanelBody>
);
}