import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import TabContent from './TabContent';
import { fetchPosts } from '../utils/fetchPosts';
import Pagination from './Pagination';


export default function PostsByTabs(props) {

    let initialData = props.attributes || {};
    const isEditor = props.isEditor || false;
    const [selectedTab, setSelectedTab] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);
    const [attributes, setAttributesState] = useState(initialData);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    
    const activeTab = attributes.tabs ? attributes.tabs[selectedTab] : null;
    const paginationType = activeTab?.options?.paginationType || 'buttons';
    const postsPerPage = attributes.numberOfItems || 10;

    const clientId = props.clientId || initialData.clientId;
    const {
        templates  = [] 
    } = initialData;

    useEffect(() => {
        getPosts(
            setIsLoading,
            setError,
            setPosts,
            setTotalPosts,
            attributes
        );
    }, [
        getPosts,
        setIsLoading,
        setError,
        setPosts,
        setTotalPosts,
        attributes,
        attributes.postType,
        attributes.taxonomy,
        attributes.terms,
        attributes.numberOfItems,
        attributes.order,
        attributes.orderBy,
        attributes.search,
        attributes.offset,
        attributes.metaFields,
        attributes.metaFields?.fields,
        attributes.metaFields?.relation,
        attributes.metaFields?.fields?.length
    ]);

    const setAttributes = (newAttrs) => {
        if (isEditor && props.setAttributes) {
            props.setAttributes(newAttrs);
        } else {
            setAttributesState(prev => ({...prev, ...newAttrs}));
        }
    };


    const handleTabChange = (event, value) => {
        setSelectedTab(value);
    };

    const handlePageChange = (page, newOffset, append = false) => {
        
        setCurrentPage(page);
        setAttributes({
            ...attributes,
            offset: newOffset
        });
       
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

        <div id={`block-content-${clientId}`} className="posts-by-tabs-content">
            <Container 
            sx={{position: 'relative'}}
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
                            clientId={clientId}
                            templates={templates}
                            posts={posts}
                            isEditor={isEditor}
                        />
                    ))}

                    {activeTab && activeTab.options?.paginationEnabled && (
                        <Pagination
                            posts={posts}
                            totalPosts={totalPosts}
                            offset={attributes.offset || 0}
                            postsPerPage={postsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            paginationType={paginationType}
                            isLoading={isLoading}
                            template={activeTab.template}
                        />
                    )}
                </Box>
            </Container>
        </div>

    );
}

async function getPosts (
    setIsLoading,
    setError,
    setPosts,
    setTotalPosts,
    attributes,
) {

    
    setIsLoading(true);
    setError(null);

    try {
        const fetchOptions = {
            headers: true,
            append: false 
        };
        
        const result = await fetchPosts({
            ...attributes
        }, fetchOptions);

        if (result.headers && result.headers['x-wp-total']) {
            setTotalPosts(parseInt(result.headers['x-wp-total']));
        }

        if (result.posts) {
            setPosts(result.posts);
        }

    } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.message);
        setPosts([]);
        setTotalPosts(0);
    } finally {
        setIsLoading(false);
    }
};