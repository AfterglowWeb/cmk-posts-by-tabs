import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import metadata from './block.json';
import ThemePalette from './components/ThemePalette';
import { ParallaxProvider } from 'react-scroll-parallax';

const EditWithTheme = (props) => (
	<ThemePalette>
		<ParallaxProvider>
			<Edit {...props} />
		</ParallaxProvider>
	</ThemePalette>
  );

registerBlockType( metadata.name, {
	edit: EditWithTheme,
} );
