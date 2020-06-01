import { SpotifyPlaylist, AudioFeature } from "../services//spotify.interface"
import { Track } from "../models/Track";
export interface PlaylistEvent{
    status:"loading"|"done",
    playlist?:SpotifyPlaylist,
    djjamTracks?:{
        [key:string]:Track
    }
    audioFeatures?:{
        [key:string]:AudioFeature
    }
    
}