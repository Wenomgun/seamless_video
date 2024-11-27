import { fileURLToPath } from 'url';

import express from 'express';
import cors from 'cors';
import path from 'path';
import { spawn  } from 'child_process';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());

// Директории
const VIDEOS_DIR = path.join(__dirname, 'videos');
const HLS_DIR = path.join(__dirname, 'hls');

// Проверяем и создаем директорию для HLS
async function ensureHlsDirectory() {
    try {
        await fs.access(HLS_DIR);
    } catch {
        await fs.mkdir(HLS_DIR, { recursive: true });
    }
}

// Генерация HLS плейлиста с помощью FFmpeg
async function generateHlsPlaylist(videoFiles) {
    await ensureHlsDirectory();

    const inputArgs = videoFiles
        .flatMap((file) => ['-i', path.join(VIDEOS_DIR, file)]);

    const filterComplex = videoFiles
        .map((_, index) => `[${index}:v:0][${index}:a:0]`)
        .join('') + `concat=n=${videoFiles.length}:v=1:a=1[outv][outa]`;

    const outputPath = path.join(HLS_DIR, 'output.m3u8');

    const ffmpegArgs = [
        ...inputArgs,
        '-filter_complex', filterComplex,
        '-map', '[outv]',
        '-map', '[outa]',
        '-f', 'hls',
        '-hls_time', '10',
        '-hls_playlist_type', 'vod',
        outputPath,
    ];

    console.log('Running FFmpeg command:', ffmpegArgs.join(' ')); // Лог команды

    return new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', ffmpegArgs);

        ffmpeg.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        ffmpeg.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        ffmpeg.on('close', (code) => {
            if (code === 0) {
                console.log('HLS playlist generated successfully');
                resolve();
            } else {
                reject(new Error(`FFmpeg process exited with code ${code}`));
            }
        });
    });
}



// Статические файлы HLS
app.use('/hls', express.static(HLS_DIR));

// Генерация HLS и возвращение видео
app.get('/generate', async (req, res) => {
    const videoFiles = ['1.mp4', '2.mp4', '3.mp4']; // Укажите ваши видеофайлы

    // Проверяем существование файлов
    for (const file of videoFiles) {
        const filePath = path.join(VIDEOS_DIR, file);
        try {
            await fs.access(filePath);
        } catch {
            return res.status(400).send(`File not found: ${file}`);
        }
    }

    try {
        await generateHlsPlaylist(videoFiles);
        res.send('HLS playlist generated successfully. Access it at /hls/output.m3u8');
    } catch (error) {
        res.status(500).send(`Error generating HLS playlist: ${error}`);
    }
});

// Главная страница для просмотра видео
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

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});




