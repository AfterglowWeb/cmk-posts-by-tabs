import { createRoot } from '@wordpress/element';
import ThemePalette from './front/ThemePalette';
import PostsByTabs from './front/PostsByTabs';

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
                <ThemePalette>
                    <PostsByTabs attributes={attributes} />
                </ThemePalette>
            )
        }
    });
});
