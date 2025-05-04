import { useState, useEffect, useRef } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { usePostTypes } from '../utils/fetchPostTypes';
import MuiSelect from './MuiSelect';

export default function PostTypeSelector({
  value,
  label = __('Post Type'),
  onChange = () => {}
}) {
  const { postTypes, isLoading, error } = usePostTypes();
  const processedRef = useRef(false);
  const [loadedPostTypes, setLoadedPostTypes] = useState([]);
  
  useEffect(() => {
    if (!isLoading && postTypes.length > 0 && !processedRef.current) {
      processedRef.current = true;
      const formattedPostTypes = postTypes.map((type) => ({
        label: type.label,
        value: type.value
      }));
      
      setLoadedPostTypes(formattedPostTypes);
    }
  }, [isLoading, postTypes]);

  // Show loading state
  if (isLoading || loadedPostTypes.length === 0) {
    return (
      <div className="post-type-selector-loading">
        <Spinner />
        <span>{__('Loading post types...')}</span>
      </div>
    );
  }

  // Show error if any
  if (error) {
    return (
      <div className="post-type-selector-error">
        {__('Error loading post types. Please refresh the page.')}
      </div>
    );
  }

  return (
    <MuiSelect
      label={label}
      options={[
        { label: __('Select post type'), value: '' },
        ...loadedPostTypes
      ]}
      value={value}
      onChange={onChange}
    />
  );
}