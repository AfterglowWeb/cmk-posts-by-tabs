import { createRoot } from '@wordpress/element';
import FrontendTabs from './components/FrontendTabs';
import ThemePalette from './components/ThemePalette';
import { ParallaxProvider } from 'react-scroll-parallax';

function initializeReactComponents() {
  const complexTabsBlocks = document.querySelectorAll('.posts-by-tabs-block');
  
  complexTabsBlocks.forEach(blockElement => {

    if (complexTabsData) {
      try {
        const root = createRoot(blockElement);
        root.render(
          <ThemePalette>
            <ParallaxProvider>
              <FrontendTabs blockData={complexTabsData} />
            </ParallaxProvider>
          </ThemePalette>
        )
      } catch (error) {
        console.error('Error initializing Complex Tabs React component:', error);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', initializeReactComponents);