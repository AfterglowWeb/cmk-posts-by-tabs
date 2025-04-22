import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import metadata from './block.json';
import ThemePalette from './front/ThemePalette';

const EditWithTheme = (props) => (
	<ThemePalette>
		<Edit {...props} />
	</ThemePalette>
  );

registerBlockType( metadata.name, {
	edit: EditWithTheme,
} );
