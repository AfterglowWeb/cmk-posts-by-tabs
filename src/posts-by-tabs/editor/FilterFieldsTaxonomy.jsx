import MuiMultipleSelect from './MuiMultipleSelect';
import MuiSelect from './MuiSelect';
import { __ } from '@wordpress/i18n';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useSelect } from '@wordpress/data';

export default function FilterFieldsTaxonomy (props) {

    const { field, index, updateField, postsByTabsSettings, selectedPostType } = props;
        const { options } = field;
        const availableTaxonomies = postsByTabsSettings?.taxonomies?.filter(tax => 
            tax.postTypes?.some(t => t.value === selectedPostType)
        ) || [];

        const handleTermsChange = (taxonomy, newTerms) => {
            const updatedField = { ...field };
            if (!updatedField.options.taxonomy.terms) {
                updatedField.options.taxonomy.terms = [];
            }
            updatedField.options.taxonomy.terms = newTerms;
            updateField(index, updatedField);
        };

        return (
            <>
                <MuiSelect
                    label={__('Taxonomy')}
                    value={options.taxonomy.value}
                    options={[
                        { label: __('Select Taxonomy'), value: '' }, 
                        ...availableTaxonomies
                    ]}
                    onChange={(value) => {
                        const updatedField = { ...field };
                        updatedField.options.taxonomy.value = value;
                        updateField(index, updatedField);
                    }}
                />

                {options.taxonomy.value && availableTaxonomies.map(tax => {
                    if (tax.value !== options.taxonomy.value || !tax.terms?.length) {
                        return null;
                    }
                    
                    const currentTaxTerms = options.taxonomy.terms || [];
           
                    return (
                        <>
                        <MuiMultipleSelect
                            key={tax.value}
                            values={tax.terms}
                            selectedValues={
                                options.taxonomy.allOptions ?
                                tax.terms.map(term => term.value) : currentTaxTerms
                            }
                            label={`Select ${tax.label} terms`}
                            onChange={(newTerms) => {
                                handleTermsChange(tax, newTerms)
                            }}
                        />
                        <FormControlLabel
                        control={
                        <Switch
                        checked={options.taxonomy.allOptions}
                        onChange={() => {
                            const updatedField = { ...field };
                            const willSelectAll = !updatedField.options.taxonomy.allOptions;
                            updatedField.options.taxonomy.allOptions = willSelectAll;
                            
                            const currentTaxonomy = options.taxonomy.value;
                            const availableTaxonomy = availableTaxonomies.find(tax => tax.value === currentTaxonomy);
                            
                            if (currentTaxonomy && availableTaxonomy && availableTaxonomy.terms) {
                                if (willSelectAll) {
                                    const allTerms = availableTaxonomy.terms.map(term => term.value);
                                    handleTermsChange(availableTaxonomy, allTerms);
                                } 
                                else {
                                    handleTermsChange(availableTaxonomy, []);
                                }
                            }

                            updateField(index, updatedField);
                        }}
                        />}
                        label={__('Select all values')}
                        />
                        </>
                    );
                })}
                
            </>
        );
    };