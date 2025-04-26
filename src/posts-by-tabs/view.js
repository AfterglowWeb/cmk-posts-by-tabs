import { createRoot } from '@wordpress/element';
import ThemePalette from './front/ThemePalette';
import PostsByTabs from './front/PostsByTabs';
import './style.scss';
import {APIProvider} from '@vis.gl/react-google-maps';


document.addEventListener('DOMContentLoaded', () => {
    
    const blockRoots = document.querySelectorAll('.posts-by-tabs-block');

    if(!blockRoots) {
        return;
    }
    blockRoots.forEach(blockRoot => {
        const dataScript = blockRoot.querySelector('.block-data');
        if(!dataScript) {
            return;
        }
        const attributes = JSON.parse(dataScript.textContent);
        if(attributes && blockRoot) {
            const root = createRoot(blockRoot);
            root.render(
                <APIProvider apiKey={attributes?.options?.googleMapsApiKey}>
                    <ThemePalette>
                        <PostsByTabs 
                        attributes={attributes} 
                        />
                    </ThemePalette>
                </APIProvider>
            )
        }
    });
});
