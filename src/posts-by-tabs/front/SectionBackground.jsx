import { __ } from '@wordpress/i18n';
import Box from '@mui/material/Box';

export default function SectionBackground(props) {

    const {background} = props;   
    if (!background) {
        return null;
    }

    if(!background.mediaUrl) {
        return null;
    }

    return(
        <>
            {(background.mediaType === 'image') && 
            <Box className="absolute inset-0 w-full h-full bg-cover bg-center" style={{backgroundImage: `url(${background.mediaUrl})`}} />}
            {(background.mediaType === 'video') && 
            <video autoPlay muted loop playsinline className="absolute inset-0 w-full h-full object-cover">
                <source src={background.mediaUrl} type="video/mp4" />
            </video>}
            {background.mediaUrl && <div className="absolute inset-0  w-full h-full  bg-black opacity-30" />}
        </>
    )

}