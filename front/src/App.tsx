// src/App.tsx
import React, { useEffect, useState } from 'react';
import VideoPlayer from './components/VideoPlayer';

const App: React.FC = () => {
    const [videoIds, setVideoIds] = useState<string[]>([]); // Стейт для хранения списка videoId
    const [currentVideoId, setCurrentVideoId] = useState<string | null>(null); // Стейт для хранения текущего videoId

    useEffect(() => {
        // Загрузка списка видеофрагментов
        const ids = ['1', '2', '3']; // Замените на динамическую загрузку, если необходимо
        setVideoIds(ids);
        setCurrentVideoId(ids[0]); // По умолчанию начинаем с первого видео
    }, []);

    const handleChangeVideo = (id: string) => {
        setCurrentVideoId(id); // Меняем текущий videoId
    };

    return (
        <div>
            <h1>Seamless Video Player</h1>
            {/* Список видео, позволяющий выбирать видео */}
            <div>
                {videoIds.map((id) => (
                    <button key={id} onClick={() => handleChangeVideo(id)}>
                        Video {id}
                    </button>
                ))}
            </div>

            {/* Компонент VideoPlayer, получающий текущий videoId */}
            <VideoPlayer videoIds={[1, 2, 3]} />
        </div>
    );
};

export default App;
