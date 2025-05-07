import { __ } from '@wordpress/i18n';
import { CheckboxControl } from '@wordpress/components';
import MuiInputSlider from './MuiInputSlider';
import MuiSelect from './MuiSelect';
import MetaKeySelector from './MetaKeySelector';

export default function TabTemplateOptions(props) {

    return (
        <div>
            {optionFields(props)}
        </div>
    );

}

function optionFields(props) {
    const { tab } = props;
    if (!tab) {
        return null;
    }
    const {template} = tab;

    switch (template) {
        case 'grid':
        case 'row':
            return <GridFields {...props} />;
        case 'calendar':
            return <CalendarFields {...props} />;
        case 'slider':
            return <SliderFields {...props} />;
        case 'map':
            return <MapFields {...props} />;
        default:
            return null;
    }
}

function GridFields(props) {
    const { tab, index, handleTabValueChange } = props;
    if (!tab) {
        return null;
    }
    
    const {
        template, 
        options
    } = tab;

    const isGridBased = ['grid', 'row'].includes(template);
    if (!isGridBased) { 
        return null;
    }

    const optionsKey = template === 'grid' ? 'grid' : template;
    const gridOptions = options?.[optionsKey] || {};
    
    const { 
        free_flow = false,
        cols_desktop = 3,
        cols_tablet = 2,
        cols_mobile = 1,
        gap_desktop = 16,
        gap_tablet = 16,
        gap_mobile = 16
    } = gridOptions;
    
    return (
        <>
            <CheckboxControl
                label={__('Free-flow layout')}
                checked={free_flow}
                onChange={(value) => handleTabValueChange(
                    {
                        ...options, 
                        [optionsKey]: {
                            ...gridOptions, 
                            free_flow: value
                        }
                    },
                    'options', 
                    index
                )}
            />
            
            <MuiInputSlider
                label={__('Columns (Desktop)')}
                min={1}
                max={12}
                step={1}
                value={cols_desktop}
                onChange={(value) => handleTabValueChange(
                    {
                        ...options, 
                        [optionsKey]: {
                            ...gridOptions, 
                            cols_desktop: value
                        }
                    },
                    'options', 
                    index
                )}
            />
            
            <MuiInputSlider
                label={__('Columns (Tablet)')}
                min={1}
                max={12}
                step={1}
                value={cols_tablet}
                onChange={(value) => handleTabValueChange(
                    {
                        ...options, 
                        [optionsKey]: {
                            ...gridOptions, 
                            cols_tablet: value
                        }
                    },
                    'options', 
                    index
                )}
            />
            
            <MuiInputSlider
                label={__('Columns (Mobile)')}
                min={1}
                max={12}
                step={1}
                value={cols_mobile}
                onChange={(value) => handleTabValueChange(
                    {
                        ...options, 
                        [optionsKey]: {
                            ...gridOptions, 
                            cols_mobile: value
                        }
                    },
                    'options', 
                    index
                )}
            />

            <MuiInputSlider
                label={__('Gap between items (Desktop)')}
                min={0}
                max={48}
                step={4}
                value={gap_desktop}
                onChange={(value) => handleTabValueChange(
                    {
                        ...options, 
                        [optionsKey]: {
                            ...gridOptions, 
                            gap_desktop: value
                        }
                    },
                    'options', 
                    index
                )}
            />

            <MuiInputSlider
                label={__('Gap between items (Tablet)')}
                min={0}
                max={48}
                step={4}
                value={gap_tablet}
                onChange={(value) => handleTabValueChange(
                    {
                        ...options, 
                        [optionsKey]: {
                            ...gridOptions, 
                            gap_tablet: value
                        }
                    },
                    'options', 
                    index
                )}
            />

            <MuiInputSlider
                label={__('Gap between items (Mobile)')}
                min={0}
                max={48}
                step={4}
                value={gap_mobile}
                onChange={(value) => handleTabValueChange(
                    {
                        ...options,
                        [optionsKey]: {
                            ...gridOptions,
                            gap_mobile: value
                        }
                    },
                    'options',
                    index
                )}
            />
            
        </>
    );
}

function CalendarFields(props) {
    const { tab, index, handleTabValueChange, postType } = props;
    if (!tab) {
        return null;
    }
    const {
        template, 
        options
    } = tab;

    if (template !== 'calendar') {
        return null;
    }

    const calendar = options?.calendar || {};
    const { start_key, end_key, default_view, has_day_view, has_week_view, has_month_view } = options?.calendar;
    
    return (
        <>
        {postType &&
        <>
        <MetaKeySelector 
        postType={postType} 
        onChange={(value) => handleTabValueChange(
            {...options, calendar: {...calendar, start_key: value}},
            'options',
            index)}
        label={__('Start key')}
        value={start_key || ''} 
        />
        <MetaKeySelector 
        postType={postType} 
        onChange={(value) => handleTabValueChange(
            {...options, calendar: {...calendar, end_key: value}},
            'options',
            index)}
        label={__('End key')}
        value={end_key || ''} 
        />
        </>
        }
        <MuiSelect
            label={__('Default view')}
            value={default_view || ''}
            options={[
                { label: __('Day'), value: 'day' },
                { label: __('Week'), value: 'week' },
                { label: __('Month'), value: 'month' },
            ]}
            onChange={(value) => handleTabValueChange(
                {...options, calendar: {...calendar, default_view: value}},
                'options', 
                index)}
        />
        <CheckboxControl
            label={__('Day view')}
            checked={has_day_view || false}
            onChange={(value) => handleTabValueChange(
                {...options, calendar: {...calendar, has_day_view: value}},
                'options', 
                index)}
        />
        <CheckboxControl
            label={__('Week view')}
            checked={has_week_view || false}
            onChange={(value) => handleTabValueChange(
                {...options, calendar: {...calendar, has_week_view: value}},
                'options', 
                index)}
        />
        <CheckboxControl
            label={__('Month view')}
            checked={has_month_view || false}
            onChange={(value) => handleTabValueChange(
                {...options, calendar: {...calendar, has_month_view: value}},
                'options', 
                index)}
        />
        </>
    );
}

function SliderFields(props) {
    const { 
        tab, index, handleTabValueChange 
    } = props;
    if (!tab) {
        return null;
    }
    const {
        template, 
        options
    } = tab;
    if (template !== 'slider') {
        return null;
    }
    const {
        slidesPerView,
        spaceBetween,
        effect,
        autoplay,
        delay,
        speed,
        hideScrollBar,
        hideNavigation,
        hidePagination,
    } = options?.slider;


    return (
        <>
        <MuiInputSlider
            label={__('Slides per view')}
            min={1}
            max={9}
            step={1}
            value={slidesPerView || 3}
            onChange={(value) => handleTabValueChange(
                {...options, slider: {...slider, slidesPerView: value}},
                'options', 
                index)}
        />
        <MuiInputSlider
            label={__('Space between')}
            min={0}
            max={100}
            step={1}
            value={spaceBetween || 0}
            onChange={(value) => handleTabValueChange(
                {...options, slider: {...slider, spaceBetween: value}},
                'options', 
                index)}
        />
        <MuiSelect
            label={__('Effect')}
            value={effect || ''}
            options={[
                { label: __('Slide'), value: 'slide' },
                { label: __('Fade'), value: 'fade' },
                { label: __('Cube'), value: 'cube' },
                { label: __('Coverflow'), value: 'coverflow' },
                { label: __('Flip'), value: 'flip' },
            ]}
            onChange={(value) => handleTabValueChange(
                {...options, slider: {...slider, effect: value}},
                'options', 
                index)}
        />
        <CheckboxControl
            label={__('Autoplay')}
            checked={autoplay || false}
            onChange={(value) => handleTabValueChange(
                {...options, slider: {...slider, autoplay: value}},
                'options', 
                index)}
        />
        <MuiInputSlider
            label={__('Delay')}
            min={0}
            max={10000}
            step={100}
            value={delay || 3000}
            onChange={(value) => handleTabValueChange(
                {...options, slider: {...slider, delay: value}},
                'options', 
                index)}
        />
        <MuiInputSlider
            label={__('Speed')}
            min={0}
            max={10000}
            step={100}
            value={speed || 300}
            onChange={(value) => handleTabValueChange(
                {...options, slider: {...slider, speed: value}},
                'options', 
                index)}
        />
        <CheckboxControl
            label={__('Hide scroll bar')}
            checked={hideScrollBar || false}
            onChange={(value) => handleTabValueChange(
                {...options, slider: {...slider, hideScrollBar: value}},
                'options', 
                index)}
        />
        <CheckboxControl
            label={__('Hide navigation')}
            checked={hideNavigation || false}
            onChange={(value) => handleTabValueChange(
                {...options, slider: {...slider, hideNavigation: value}},
                'options', 
                index)} 
        />
        <CheckboxControl
            label={__('Hide pagination')}
            checked={hidePagination || false}
            onChange={(value) => handleTabValueChange(
                {...options, slider: {...slider, hidePagination: value}},
                'options', 
                index)}
        />
        </>
    );
}

function MapFields(props) {


    const { tab, index, handleTabValueChange } = props;
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

   
    const mapStyles = {
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
            name: __('Default', 'posts-by-tabs'),
            description: __('Standard Google Maps style', 'posts-by-tabs'),
            previewColor: '#4285f4'
        }
    };

  const { mapStyle } = options?.mapStyle || 'red';

  return (
    <MuiSelect
    label={__('Map style')}
    value={mapStyle}
    options={
    Object.entries(mapStyles).map(([key, value]) => ({
        value: key,
        label: (
        <div key={key} className="flex items-center">
            <div
            className="w-4 h-4 mr-2 rounded-full shadow"
            style={{
                backgroundColor: value.previewColor,
            }}
            />
            <span>{value.name}</span>
        </div>
        ),
    }))
    }
    onChange={(value) => handleTabValueChange(
        {...options, map: {...options.map, mapStyle: value}},
        'options', 
        index)}
    />
  );
}