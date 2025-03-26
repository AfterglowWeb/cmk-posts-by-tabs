import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { ParallaxProvider } from 'react-scroll-parallax';

import TabContent from './TabContent';
import SectionBackground from '../components/SectionBackground';

export default function PostsByTabs(props) {
    const { attributes, setAttributes, handleTabValueChange, clientId } = props;
    const [selectedTab, setSelectedTab] = useState(0);
    const [editingContent, setEditingContent] = useState(null);
    const { selectBlock } = useDispatch('core/block-editor');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            setError(null);
            console.log("Fetching posts with attributes:", attributes);
            try {

                var restEndpoint = `/wp/v2/${attributes.postType || 'posts'}`;
                if(attributes.postType === 'post') {
                    restEndpoint = `/wp/v2/posts`;
                }

                if(attributes.postType === 'page') {
                    restEndpoint = `/wp/v2/pages`;
                }
     
                var queryPath = `${restEndpoint}?_embed&per_page=${attributes.numberOfItems || 5}`;
                
                if (attributes.order) {
                    queryPath += `&order=${attributes.order}`;
                }
                if (attributes.orderBy) {
                    queryPath += `&orderby=${attributes.orderBy}`;
                }
                
                if (attributes.taxonomy && attributes.term) {
                    queryPath += `&${attributes.taxonomy}=${attributes.term}`;
                }
                
                console.log("Fetching posts with query:", queryPath);
                const fetchedPosts = await wp.apiFetch({ path: queryPath });
                console.log("Fetched posts:", fetchedPosts);
                setPosts(fetchedPosts);
                
                // Store the posts in the block attributes if you want to cache them
                setAttributes({ posts: fetchedPosts });
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError(err.message);
                setPosts([]);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchPosts();
    }, [
        attributes.postType,
        attributes.taxonomy,
        attributes.term,
        attributes.numberOfItems,
        attributes.order,
        attributes.orderBy
    ]);

    const handleTabChange = (event, value) => {
		
        selectBlock(clientId);
        setSelectedTab(value);
	  };

      const ensureBlockSelected = (e) => {
        if (e.currentTarget === e.target) {
            selectBlock(clientId);
        }
    };

    const renderPostsStatus = () => {
        if (isLoading) {
            return <div className="p-4 text-center">Loading posts...</div>;
        }
        
        if (error) {
            return <div className="p-4 text-center text-red-600">Error: {error}</div>;
        }
        
        if (posts.length === 0) {
            return <div className="p-4 text-center">No posts found matching your criteria.</div>;
        }
        
        return null;
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

                    {renderPostsStatus()}

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
                            posts={posts}
                        />
                    ))}
                </Box>
            </Container>
        </div>

        
    );
}