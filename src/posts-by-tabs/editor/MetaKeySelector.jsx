import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';
import MuiSelect from './MuiSelect';
import { useMetaKeys } from '../utils/fetchMetaKeys';

export default function MetaKeySelector(props) {
    const { postType, label, value, onChange } = props;
    const { metaKeys, isLoading, error } = useMetaKeys(postType);
    
    if (isLoading) return <Spinner />;
    if (error) return <div>Error loading meta keys</div>;
    
    return (
        <MuiSelect
            label={label}
            options={[
                { label: __('Select meta key'), value: '' },
                ...metaKeys
            ]}
            value={value || ''}
            onChange={onChange}
        />
    );
}