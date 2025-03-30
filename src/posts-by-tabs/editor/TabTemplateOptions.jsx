import { __ } from '@wordpress/i18n';
import { CheckboxControl } from '@wordpress/components';
import MuiInputSlider from './MuiInputSlider';
import MuiSelect from './MuiSelect';

export default function TabTemplateOptions(props) {

    return (
        <div className="px-4">
            <h2 className="text-lg font-semibold mb-4">{__('Template Options')}</h2>
            {optionFields(props)}
        </div>
    );

}


function optionFields(props) {

    const { tab, index, handleTabValueChange } = props;
    if (!tab) {
        return null;
    }
    const {
        template, 
        options
    } = tab;


    switch (template) {
        case 'posts-grid':
            const { grid_col_number, grid_is_free } = options;
            return (
                <>
                <MuiInputSlider
                label={__('Number of cols')}
                min={1}
                max={9}
                step={1}
                value={grid_col_number || 3}
                onChange={(value) => handleTabValueChange(
                    {...options, grid_col_number: value},
                    'options', 
                    index)}
                />
                <CheckboxControl
                    label={__('Free cols')}
                    checked={grid_is_free || false}
                    onChange={(value) => handleTabValueChange(
                        {...options, grid_is_free: value},
                        'options', 
                        index)}
                />
                </>
            );
        case 'calendar':
            const { calendar_default_view, calendar_has_day_view, calendar_has_week_view, calendar_has_month_view } = options;
            return (
                <>
                <MuiSelect
                    label={__('Default view')}
                    value={calendar_default_view || ''}
                    options={[
                        { label: __('Day'), value: 'day' },
                        { label: __('Week'), value: 'week' },
                        { label: __('Month'), value: 'month' },
                    ]}
                    onChange={(value) => handleTabValueChange(
                        {...options, calendar_default_view: value},
                        'options', 
                        index)}
                />
                <CheckboxControl
                    label={__('Day view')}
                    checked={calendar_has_day_view || false}
                    onChange={(value) => handleTabValueChange(
                        {...options, calendar_has_day_view: value},
                        'options', 
                        index)}
                />
                <CheckboxControl
                    label={__('Week view')}
                    checked={calendar_has_week_view || false}
                    onChange={(value) => handleTabValueChange(
                        {...options, calendar_has_week_view: value},
                        'options', 
                        index)}
                />
                <CheckboxControl
                    label={__('Month view')}
                    checked={calendar_has_month_view || false}
                    onChange={(value) => handleTabValueChange(
                        {...options, calendar_has_month_view: value},
                        'options', 
                        index)}
                />
                </>
            );
        case 'posts-slider':
            const { slider_col_number, slider_is_free } = options;
            return (
                <>
                <MuiInputSlider
                label={__('Number of cols')}
                min={1}
                max={9}
                step={1}
                value={slider_col_number || 3}
                onChange={(value) => handleTabValueChange(
                    {...options, slider_col_number: value},
                    'options', 
                    index)}
                />
                <CheckboxControl
                    label={__('Free cols')}
                    checked={slider_is_free || false}
                    onChange={(value) => handleTabValueChange(
                        {...options, slider_is_free: value},
                        'options', 
                        index)}
                />
                </>
            );

        case 'posts-grid-simple-row':
            const { grid_simple_row_col_number, grid_simple_row_is_free } = options;
            return (
                <>
                <MuiInputSlider
                label={__('Number of cols')}
                min={1}
                max={9}
                step={1}
                value={grid_simple_row_col_number || 3}
                onChange={(value) => handleTabValueChange(
                    {...options, grid_simple_row_col_number: value},
                    'options', 
                    index)}
                />
                <CheckboxControl
                    label={__('Free cols')}
                    checked={grid_simple_row_is_free || false}
                    onChange={(value) => handleTabValueChange(
                        {...options, grid_simple_row_is_free: value},
                        'options', 
                        index)}
                />
                </>
            );
        case 'events-map':
            const { map_is_free } = options;
            return (
                <>
                <CheckboxControl
                    label={__('Free cols')}
                    checked={map_is_free || false}
                    onChange={(value) => handleTabValueChange(
                        {...options, map_is_free: value},
                        'options', 
                        index)}
                />
                </>
            );
        default:
            return null;
    }
}