import { Panel, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import MuiSelect from './MuiSelect';


const MAP_STYLES = {
  red: {
    id: 'red',
    name: __('Red Theme', 'posts-by-tabs'),
    description: __('Bold red theme with red landscapes and roads', 'posts-by-tabs'),
    previewColor: '#d13d40',
  },
  green: {
    id: 'green',
    name: __('Green Theme', 'posts-by-tabs'),
    description: __('Natural green theme with green landscapes', 'posts-by-tabs'),
    previewColor: '#2a4360',
  },
  standard: {
    id: 'standard',
    name: __('Default Google Maps', 'posts-by-tabs'),
    description: __('Standard Google Maps style', 'posts-by-tabs'),
    previewColor: '#4285f4'
  }
};

export default function MapStyleSelector(props) {

  const { tab, index, handleTabValueChange, postType } = props;
  if (!tab) {
      return null;
  }
  const {
      template, 
      options
  } = tab;

  if (template !== 'map') {
      return null;
  }

  const { styleId } = options?.map || 'red';

  return (
    <Panel>
      <PanelBody title={__('Map Style', 'posts-by-tabs')} initialOpen={true}>
  
        <MuiSelect
              label={__('Map style')}
              value={styleId}
              options={
                Object.entries(MAP_STYLES).map(([key, value]) => ({
                  value: key,
                  label: (
                    <div key={key} className="flex items-center">
                      <div
                        className="w-4 h-4 mr-2"
                        style={{
                          backgroundColor: value.previewColor,
                          borderRadius: '50%',
                          border: '2px solid #000',
                        }}
                      />
                      <span>{value.name}</span>
                    </div>
                  ),
                }))
              }
              onChange={(value) => handleTabValueChange(
                  {...options, map: {...options.map, styleId: value}},
                  'options', 
                  index)}
          />
        
      </PanelBody>
    </Panel>
  );
}