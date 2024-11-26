import express from 'express';
import cors from 'cors';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';

const tempFileList = path.join(os.tmpdir(), 'filelist.txt');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ffmpeg.setFfmpegPath('C:/ffmpeg/bin/ffmpeg.exe');
ffmpeg.setFfprobePath('C:/ffmpeg/bin/ffprobe.exe');

const app = express();
const PORT = 3000;

app.use(cors());

const VIDEO_DIR = path.join(__dirname, 'videos');

app.get('/combined-video', (req, res) => {
    const videoFiles = ['1.mp4', '2.mp4']; // Список видеофайлов
    const inputFiles = videoFiles.map((file) => path.join(VIDEO_DIR, file));

    inputFiles.forEach(file => {
        if (!fs.existsSync(file)) {
            console.error(`File not found: ${file}`);
            res.status(400).send(`Missing file: ${file}`);
            return;
        }
    });

    const outputFile = path.join(__dirname, 'combined.mp4');
    const tempFileList = path.join(__dirname, 'filelist.txt');
    const fileListContent = inputFiles.map(file => `file '${file.replace(/\\/g, '/')}'`).join('\n');

    fs.writeFileSync(tempFileList, fileListContent, { encoding: 'utf8', mode: 0o644 });

    console.log('Temporary filelist content:');
    console.log(fileListContent);

    ffmpeg()
        .input(tempFileList)
        .inputOptions(['-safe', '0']) // Устанавливаем безопасный режим
        .inputFormat('concat')
        .output(outputFile)
        .outputOptions(['-c:v', 'libx264', '-c:a', 'aac']) // Передаем опции как массив
        .on('start', commandLine => {
            console.log('FFmpeg process started:', commandLine);
        })
        .on('end', () => {
            console.log('Video merging finished');
            res.download(outputFile);
        })
        .on('error', err => {
            console.error('Error during merging:', err.message);
            res.status(500).send('Error merging videos');
        })
        .run();


});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
