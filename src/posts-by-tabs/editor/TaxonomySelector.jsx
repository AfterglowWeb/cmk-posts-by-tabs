import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';
import MuiSelect from './MuiSelect';
import { useTaxonomies } from '../utils/fetchTaxonomies';

export default function TaxonomySelector(props) {
    const { postType, label, value, onChange } = props;
    const { Taxonomies, isLoading, error } = useTaxonomies(postType);
    
    if (isLoading) return <Spinner />;
    if (error) return <div>Error loading meta keys</div>;
    
    return (
        <MuiSelect
            label={label}
            options={[
                { label: __('Select post types'), value: '' },
                ...Taxonomies
            ]}
            value={value || ''}
            onChange={onChange}
        />
    );
}