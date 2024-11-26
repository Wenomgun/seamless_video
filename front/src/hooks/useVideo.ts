import { useQuery } from '@tanstack/react-query';

export const useFetchVideoFragment = (videoId: string) => {
    return useQuery({
        queryKey: ['videoFragment', videoId],
        queryFn: async () => {
            console.log('Fetching video fragment...');
            const response = await fetch(`http://localhost:3000/video/${videoId}`);
            if (!response.ok) {
                throw new Error('Failed to load video fragment');
            }
            const data = await response.arrayBuffer();
            console.log('Video data fetched, byte length:', data.byteLength);
            return data;
        }
    });
};
