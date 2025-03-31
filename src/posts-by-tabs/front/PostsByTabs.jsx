import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import TabContent from './TabContent';
import SectionBackground from './SectionBackground';
import { fetchPosts } from '../utils/fetchPosts';
import Pagination from './Pagination';


export default function PostsByTabs(props) {
    const { attributes, setAttributes, handleTabValueChange, clientId, templates } = props;
    const [selectedTab, setSelectedTab] = useState(0);
    const [editingContent, setEditingContent] = useState(null);
    const { selectBlock } = useDispatch('core/block-editor');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);
    const [calendarPosts, setCalendarPosts] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const activeTab = attributes.tabs ? attributes.tabs[selectedTab] : null;
    const paginationType = activeTab?.options?.paginationType || 'buttons';
    const postsPerPage = attributes.numberOfItems || 10;

    useEffect(() => {
        const getPosts = async () => {
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

                if (result.calendar_posts) {
                    setCalendarPosts(result.calendar_posts);
                }
                
                setPosts(result.posts || result);
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError(err.message);
                setPosts([]);
                setTotalPosts(0);
                setCalendarPosts([]);
            } finally {
                setIsLoading(false);
            }
        };
        
        getPosts();
    }, [
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
        attributes.metaFields?.fields?.length,
    ]);


    const handleTabChange = (event, value) => {
        selectBlock(clientId);
        setSelectedTab(value);
	};

    const handlePageChange = (page, newOffset, append = false) => {
        
        setCurrentPage(page);
        setAttributes({
            ...attributes,
            offset: newOffset
        });
        
        if (append) {
            // We'll handle this in the useEffect by passing append option to fetchPosts
        }
        
        if (!append) {
            window.scrollTo({
                top: document.getElementById(`block-${clientId}`).offsetTop - 50,
                behavior: 'smooth'
            });
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
                            calendarPosts={calendarPosts}
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