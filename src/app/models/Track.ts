import { AudioFeature } from "../services/spotify.interface"
interface Album{
    id:string
    images: Array<{
        height:number,
        url:string,
        width
    }>
    release_date:string,
    release_date_precision:string
}

export interface TrackType{
    name: string,
    description:string,
    default_tag_name: string,
    tags:any,
    is_selected?: boolean | undefined
}

export interface TrackCsv{
    name:string,
    tags:Array<string>,
    artists:Array<string>
    bpm:number,
    duration:number;
    url:string
}

export interface Track{
    album: Album,
    artists: Array<{
        id:string,
        name:string
    }>,
    audio_feature: AudioFeature
    bpm: number
    duration: number    
    name: string
    playlist?: any
    chart?:any
    preview_url: string | null | undefined,
    spotify_uri: string
    tags: any
    url: string
    year: string
    id?:string
}

export class TrackHelper{
    _track:any;
    _name_track_version:any;
    _name_track_url:any;
    _name_track:any;
    _artist_track:any;
    _artist_id:any;
    constructor(private tracks:Array<Track>){
        this._track ={};
        this._name_track_url ={};
        this._name_track = {};
        this._artist_track = {};
        this._name_track_version = {};
        this._artist_id = {}
        tracks.forEach(item => {
            if(this._name_track[item.name] ){
                this._name_track[item.name]++;
                //check version
                this._name_track_version[item.name][item.artists.map(a => a.name).join(' ')] = true;
                this._name_track_url[item.name][item.artists.map(a => a.name).join(' ')] = item.url
            }else{
                this._name_track[item.name] = 1;
                this._name_track_version[item.name] =  {};
                this._name_track_url[item.name] = {};
                this._name_track_version[item.name][item.artists.map(a => a.name).join(' ')] = true;
                this._name_track_url[item.name][item.artists.map(a => a.name).join(' ')] = item.url
                
            }
            item.artists.forEach(artist => {
                if(this._artist_track[artist.name])
                    this._artist_track[artist.name]++;
                else
                    this._artist_track[artist.name] = 1;
                this._artist_id[artist.name] = artist.id
            })
        })

        
    }

    private getTrackObject(objectName:string){
        return  Object.keys(this[objectName]).map(name => {
            return {
                name:name,
                count:this[objectName][name]
            }
        })
    }
    
    getTopTrackName(top:number = 20):Array<{name:string, count:number, versionCount:number, urls:Array<string>}>{
        return  this.getTrackObject("_name_track").map(item => {
            return {
                ...item,
                versionCount: Object.keys(this._name_track_version[item.name]).length,
                urls: Object.keys(this._name_track_url[item.name]).map(k => this._name_track_url[item.name][k])
            }

        }).sort((itemA, itemB) =>{
            if(itemA.count > itemB.count)
                return -1
            else if(itemA.count == itemB.count && itemA.versionCount < itemB.versionCount )
                return -1;
            else
                return 1;
        }).filter(item => item.count > 1).slice(0, top);
    }

    getTopArtistName(top:number = 20):Array<{name:string, count:number, id:string}>{
        let objectName = "_artist_track";
        return this.getTrackObject("_artist_track").map(item => ({
            ...item,
            id: this._artist_id[item.name]
        })).sort((keyA, keyB) => {
            if(this[objectName][keyA.name] > this[objectName][keyB.name])
                return -1;
            else
                return 1;
        }).filter(item => item.count > 1).slice(0, top);
    }

    getTrackTypeInfo(type:TrackType, exclude_tags:Array<string> = []){
        let tracks = this.tracks.filter(track => {
            let isExclude = exclude_tags.filter(excludeTag =>  track.tags[excludeTag]).length > 0
            return !isExclude
        })
        let tagNameScore:any = {  };
        //tagNameScore[type.default_tag_name] = 0;

        Object.keys( type.tags).forEach(typeTag => {
            tagNameScore[type.tags[typeTag]] = 0;
            let typeCount = tracks.filter(track =>{
                if(track.tags)
                    return track.tags[typeTag]
                else
                    return false;
            } ).length;
            tagNameScore[type.tags[typeTag]] = typeCount;
        })
        tagNameScore[type.default_tag_name] = Object.keys(tagNameScore).reduce((p, c) =>{
        
            return p - tagNameScore[c]
        }, tracks.length)
        return Object.keys(tagNameScore).map(tagName => ({
            name: tagName,
            value: tagNameScore[tagName]
        }));
    }

    getCsvDataHeader(){
        return {
            artists:"Artist",
            bpm:"Bpm",
            duration:"Duration(ms)",
            name:"Name",
            tags:"Tags",
            url:"Url"
        }
    }

    getCsvData(){
        return this.tracks.map(track => {
            let ct:TrackCsv = {
                artists: track.artists.map(a => a.name),
                bpm: track.bpm,
                duration: track.duration,
                name: track.name,
                tags: Object.keys(track.tags),
                url: track.url
            }
            return ct
        }).map(t => {
            let obj:any = {};
            Object.keys(t).forEach(key => {   
                if(t[key] instanceof Array )
                    obj[key] = (t[key] as Array<any>).join(' ')
                else
                    obj[key] = t[key] 
            })   
            return obj
        })
    }
}

export interface Playlist{
    name:string,
    id:string,
    imageUrl:string
    isPublished:boolean
}