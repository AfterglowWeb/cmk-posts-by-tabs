import { __ } from '@wordpress/i18n';
import MuiSelect from './MuiSelect';

export default function MetaKeySelector({ 
    value,
    label = __('Meta Key'),
    onChange = () => {},
    postsByTabsSettings,
    selectedPostType
}) {
  if (!postsByTabsSettings) {
    return null
  }

  if (!postsByTabsSettings.metasByPostType ||
      !postsByTabsSettings.postTypes) {
    return null
  }

  return (
  <>
    {postsByTabsSettings.metasByPostType && postsByTabsSettings.postTypes && postsByTabsSettings.postTypes.map(postType => {
            
      const hasMetaFields = postsByTabsSettings.metasByPostType && 
        postsByTabsSettings.metasByPostType[postType.value] &&
        Object.keys(postsByTabsSettings.metasByPostType[postType.value]).length > 0;

      if (!hasMetaFields) {
          return null;
      }

      return (
          <MuiSelect
          key={postType.value + '-orderby-metafield'}
          label={`${label}`}
          options={[
              { label: __('Select meta field'), value: '' },
              ...(hasMetaFields 
                  ? Object.values(postsByTabsSettings.metasByPostType[postType.value]).map(field => ({
                      label: field.label,
                      value: field.value
                  }))
                  : [])
          ]}
          value={value || ''}
          onChange={onChange}
          className={`${selectedPostType &&
                  selectedPostType === postType.value &&
                  ( orderBy === 'meta_value' || orderBy === 'meta_value_num' )  ? "" : "hidden"}`
          }
          />)

      })} 
    </>
  )


}