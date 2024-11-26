import axios from 'axios';

// Загружает видеофрагмент по ID
export const fetchVideoFragment = async (id: number): Promise<Uint8Array> => {
    const response = await axios.get(`/video/${id}`, {
        responseType: 'arraybuffer', // Получаем данные как бинарный буфер
    });
    return new Uint8Array(response.data);
};
