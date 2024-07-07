import { Track } from './Track';

//for display
export interface Scene {
  id: string;
  name: string;
  picture?: string;
}

export interface Chart {
  name: string;
  scene: Scene;
  track_ids: Array<string>;
  djs: Array<{
    name: string;
    url: string;
    picture: string;
  }>;
}
