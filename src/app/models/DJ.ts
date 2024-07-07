export interface DJ {
  name: string;
  description?: string;
  picture: string;
  scenes?: any; //key value of scene-id:true
  playlist_urls: Array<string>;
  track_ids?: Array<string>;
  user_id?: string;
}
