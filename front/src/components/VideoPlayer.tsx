import React, { useState, useEffect } from 'react';

const VideoPlayer = () => {
    const [loading, setLoading] = useState(true);

    const checkVideo = async () => {
        const url = `http://localhost:3000/combined-video`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                setLoading(false);
            } else {
                console.error('Video not found');
            }
        } catch (error) {
            console.error('Error fetching video:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        checkVideo();
    }, []);

    return (
        <div>
            {loading && <p>Loading video...</p>}
            <video controls>
                <source src="http://localhost:3000/combined-video" type="video/mp4" />
                Ваш браузер не поддерживает видео.
            </video>
        </div>
    );
};

export default VideoPlayer;
