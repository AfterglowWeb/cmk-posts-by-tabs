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

function hasMetaQuery(attributes) {
    if(
        attributes.metaFields?.fields && 
        attributes.metaFields?.fields.length > 0 
        ) {
            return true;
    }
    return false;
} 

export default function PostsByTabs(props) {
    const { attributes, setAttributes, handleTabValueChange, clientId, templates } = props;
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
      
            try {
                let fetchedPosts;
                const useMetaQuery = hasMetaQuery(attributes);
                
                if (useMetaQuery) {
                    const endpoint = '/posts-by-tabs/v1/posts';
      
                    const requestData = {
                        post_type: attributes.postType || 'post',
                        per_page: attributes.numberOfItems || 5,
                        order: attributes.order || 'desc',
                        orderby: attributes.orderBy || 'date',
                        meta_query: attributes.metaFields,
                    };
     
                    if (attributes.taxonomy && attributes.terms && attributes.terms.length > 0) {

                        requestData.terms = {};
                        requestData.terms[attributes.taxonomy] = attributes.terms;
                    }

                    fetchedPosts = await wp.apiFetch({ 
                        path: endpoint,
                        method: 'POST',
                        data: requestData
                    });

                } else {

                    var restEndpoint = `/wp/v2/${attributes.postType || 'posts'}`;
                    if (attributes.postType === 'post') {
                        restEndpoint = `/wp/v2/posts`;
                    } else if (attributes.postType === 'page') {
                        restEndpoint = `/wp/v2/pages`;
                    }

                    var queryPath = `${restEndpoint}?_embed&per_page=${attributes.numberOfItems || 5}`;
                
                    if (attributes.order) {
                        queryPath += `&order=${attributes.order}`;
                    }
                    if (attributes.orderBy) {
                        queryPath += `&orderby=${attributes.orderBy}`;
                    }

                    if (attributes.taxonomy && attributes.terms && attributes.terms.length > 0) {
                        if (attributes.taxonomy === 'category') {
                            queryPath += `&categories=${attributes.terms.join(',')}`;
                        } else {
                            queryPath += `&${attributes.taxonomy}=${attributes.terms.join(',')}`;
                        }
                    }

                    fetchedPosts = await wp.apiFetch({ path: queryPath });
                }

                setPosts(fetchedPosts);

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
        attributes.terms,
        attributes.numberOfItems,
        attributes.order,
        attributes.orderBy,
        attributes.metaFields,
        attributes.metaFields?.fields,
        attributes.metaFields?.relation,
        attributes.metaFields?.fields?.length,
    ]);

    const handleTabChange = (event, value) => {
		
        selectBlock(clientId);
        setSelectedTab(value);
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

    const maxWidth = () => {
        if (attributes.align === 'full') {
            return false;
        } else if (attributes.align === 'wide') {
            return 'xl';
        } else {
            return 'lg';
        }
    }
    
    return (

        <div { ...useBlockProps() } >
            <Container 
            sx={{position: 'relative'}}
            onClick={(e) => {
                selectBlock(clientId);
            }}
            maxWidth={maxWidth()}
            >
                {attributes.title && 
                <Box 
                component="h2" 
                className={`font-bold text-3xl lg:text-[40px] lg:leading-[50px] mb-0`}>
                    {attributes.title}
                </Box>}

                {attributes.subtitle && <p className="font-bold text-xl text-[30px] mb-0">
                    <strong>{attributes.subtitle}</strong>
                </p>}
                
                <Box>
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
                            templates={templates}
                            posts={posts}
                        />
                    ))}
                </Box>
            </Container>
        </div>

        
    );
}