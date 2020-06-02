

export interface SpotifyTrackItem{
    added_at:string,
    added_by:any;
    is_local:boolean,
    primary_color:any,
    track:{
      uri:string,
      album:any;
      artists:Array<{
        external_urls:{[key:string]:string},
        href:string,
        id:string,
        name:string,
        type:"artist",
        uri:"string"
      }>,
      available_markets:Array<string>,
      disc_number:1,
      duration_ms:number,
      id:string,
      href:string,
      name:string,
      popularity:number,
      preview_url:string
      track_number:number,
      type:'track'
    },
    video_thumbnail:{
      url:string | null
    }
  
  }
  
  export interface SpotifyPlaylist{
    collaborative: boolean
    description: string
    external_urls: any
    followers: {href: any, total: number}
    href: string
    id: string
    images: Array<{
        height:number,
        url:string,
        width:string
    }>
    name: string
    owner: {display_name: string, external_urls: any, href: string, id: string, type: string, uri:string}
    primary_color: any
    public: boolean
    snapshot_id: string
    tracks: {href: string, items: Array<SpotifyTrackItem>, limit: number, next: any, offset: number, previous:any, total:number}
    type: string
    uri: string
  }

  export interface AudioFeature{
    acousticness: number
    analysis_url: string
    danceability: number
    duration_ms: number
    energy: number
    id: string
    instrumentalness: number
    key: number
    liveness: number
    loudness: number
    mode: number
    speechiness: number
    tempo: number
    time_signature: number
    track_href: string
    type: "audio_features"
    uri: string
    valence: number
  }