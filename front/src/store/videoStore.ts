// src/store/videoStore.ts
import { makeAutoObservable } from 'mobx';

class VideoStore {
    videoIds: string[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setVideoIds(ids: string[]) {
        this.videoIds = ids;
    }
}

export const videoStore = new VideoStore();
