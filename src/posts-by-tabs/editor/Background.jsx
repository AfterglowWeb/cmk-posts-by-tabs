import { __ } from '@wordpress/i18n';
import { 
    MediaUpload, 
    MediaUploadCheck
} from '@wordpress/block-editor';
import { 
    CheckboxControl,
} from '@wordpress/components';
import { 
    useEffect
} from '@wordpress/element';
import Button from '@mui/material/Button';

export default function Background({attributes, setAttributes}) {

    useEffect(() => {

        if (!attributes.background || typeof attributes.background !== 'object') {
            setAttributes({ background: {
                isParallax: false,
                mediaId: 0,
                mediaUrl: '',
                mediaType: '',
                mediaAlt: ''
            } });
        }

    }, [attributes.background, setAttributes]);


    const onSelectMedia = (media, key) => {
        if (!media || !media.id) {
            console.error('Invalid media object received', media);
            return;
        }
        setAttributes({
            [key]: {
                isParallax: attributes[key]?.isParallax || false,
                mediaId: media.id,
                mediaUrl: media.url,
                mediaType: media.type,
                mediaAlt: media.alt
            }
        });
    };

    const removeMedia = (key) => {
        setAttributes({
            [key]: {
                isParallax: attributes[key]?.isParallax || false,
                mediaId: 0,
                mediaUrl: '',
                mediaType: '',
                mediaAlt: ''
            }
        });
    };
    
    return (
        <>
        <MediaUploadCheck>
            <MediaUpload
            onSelect={ ( media ) => {onSelectMedia(media, 'background')} }
            allowedTypes={ ['image'] }
            value={ attributes.background?.mediaId }
            render={ ( { open } ) => (
                <Button color="secondary" className="mb-2 bg-slate-50 aspect-video" onClick={ open }>
                    {attributes.background?.mediaUrl ? 
                        <img src={attributes.background?.mediaUrl} alt={attributes.background?.mediaAlt || ''} className="w-full h-full object-cover"/>
                            :
                        __('Sélectionner une image')
                    }
                </Button>
            ) }
            />
        </MediaUploadCheck>
        {attributes.background?.mediaId != 0 && 
        <div className="mt-2">
            <MediaUploadCheck>
                <Button 
                color="secondary"
                variant="outlined" 
                size="small" 
                sx={{textTransform:"none"}} 
                onClick={() => {removeMedia('background')}}>{__('Supprimer l\'image')}</Button>
            </MediaUploadCheck>
        </div>
        }
        <CheckboxControl label="Effet parallaxe"
        __nextHasNoMarginBottom
        checked={ attributes.background?.isParallax }
        onChange={ (value) => 
            setAttributes({ 
                background: {
                    ...attributes.background, 
                    isParallax : value
                } 
            }) 
        }/>
        </>
    );  
}