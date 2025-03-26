import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { ParallaxProvider } from 'react-scroll-parallax';

import TabContent from './TabContent';
import SectionBackground from '../components/SectionBackground';

export default function Editor(props) {
    const { attributes, setAttributes, handleTabValueChange, clientId } = props;
    const [selectedTab, setSelectedTab] = useState(0);
    const [editingContent, setEditingContent] = useState(null);
    const { selectBlock } = useDispatch('core/block-editor');

    const handleTabChange = (event, value) => {
		
        selectBlock(clientId);
        setSelectedTab(value);
	  };

      const ensureBlockSelected = (e) => {
        if (e.currentTarget === e.target) {
            selectBlock(clientId);
        }
    };
    
    
    return (

        <div { ...useBlockProps() } 
        className="p-4 md:p-6 lg:p-8 bg-primary-light relative overflow-hidden"
        onClick={ensureBlockSelected}
        >

            <Container 
            maxWidth="xl" 
            sx={{position: 'relative', zIndex: 10}}
            onClick={(e) => {
                selectBlock(clientId);
            }}
            >
                {attributes.title && 
                <Box 
                component="h2" 
                sx={{color:'secondary.main'}} 
                className={`font-bold text-3xl lg:text-[40px] lg:leading-[50px] mb-0`}>
                    {attributes.title}
                </Box>}

                {attributes.subtitle && <p className="font-bold text-xl text-[30px] mb-0">
                    <strong>{attributes.subtitle}</strong>
                </p>}
                
                <Box 
                sx={({theme}) => ({
                    backgroundColor: "white",
                    borderRadius: '2px',
                })}
                >
                    <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="detailed list tabs"
                    sx={{ mb: 3 }}
                    >
                        {attributes.tabs && attributes.tabs.map((tab, index) => (
                            <Tab 
                                key={index}
                                label={tab.title}
                                id={`tab-${index}`}
                                aria-controls={`tabpanel-${index}`}
                            />
                        ))}
                    </Tabs>

                    {attributes.tabs?.map((tab, index) => (
                        <TabContent
                            key={index}
                            tab={tab}
                            index={index}
                            selectedTab={selectedTab}
                            editingContent={editingContent}
                            setEditingContent={setEditingContent}
                            handleTabValueChange={handleTabValueChange}
                            clientId={clientId}
                        />
                    ))}
                </Box>
            </Container>
        </div>

        
    );
}