import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';
import MuiSelect from './MuiSelect';
import { usePostTypes } from '../utils/fetchPostTypes';

export default function PostTypeSelector(props) {
    const { postType, label, value, onChange } = props;
    const { PostTypes, isLoading, error } = usePostTypes(postType);
    
    if (isLoading) return <Spinner />;
    if (error) return <div>Error loading meta keys</div>;
    
    return (
        <MuiSelect
            label={label}
            options={[
                { label: __('Select post types'), value: '' },
                ...PostTypes
            ]}
            value={value || ''}
            onChange={onChange}
        />
    );
}