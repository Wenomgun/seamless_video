import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Включаем CORS
app.use(cors());

// Статическая раздача HLS-файлов
app.use('/hls', express.static(path.join(__dirname, 'hls')));

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
            </head>
            <body>
                <video id="video" controls autoplay width="640" height="360"></video>
                <script>
                    const video = document.getElementById('video');
                    if (Hls.isSupported()) {
                        const hls = new Hls();
                        hls.loadSource('/hls/output.m3u8');
                        hls.attachMedia(video);
                    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                        video.src = '/hls/output.m3u8';
                    }
                </script>
            </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});



