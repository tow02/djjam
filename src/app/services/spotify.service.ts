import { Injectable, EventEmitter } from '@angular/core';
import { TrackService } from "./track.service"
import { environment } from "../../environments/environment"
import { SpotifyPlaylist, AudioFeature, SpotifyTrackItem, SpotifyArtist, SpotifyUser } from "./spotify.interface"
import { Track } from '../models/Track';

const DJJAM_MAIN_TAGS = {
  'live':"Live",
  'valence':"Feel Good",
  'energetic':'Energetic',
  'energy':'Energetic',
  'mellow':'Mellow',
  'nonvocal':'Instrusmental only',
  'vocal':'Vocal'
}

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  client_id = environment.client_id;
  onAuthChange:EventEmitter<{state:"signin" | "signout", option?:any}> = new EventEmitter<{state:"signin" | "signout", option?:any}>();


  //private authorizeCode:string;
  private accessToken: any;
  private tokenType: string;

  constructor(private trackService:TrackService ) { }

  isConnect(){
    if(localStorage[environment.localstorage.spotify_expire_in] && localStorage[environment.localstorage.spotify_access_token] && localStorage[environment.localstorage.spotify_age]){
      
      let now = new Date().getTime()
      console.log('exist', now, Number(localStorage[environment.localstorage.spotify_age]), now-Number(localStorage[environment.localstorage.spotify_age]))
      if(now - Number(localStorage[environment.localstorage.spotify_age]) <= Number(localStorage[environment.localstorage.spotify_expire_in])*1000 /2)
        return true;
      else
        return false;
    }else
      return false;
    /*if(this.accessToken && this.tokenType)
      return true;
    else if(localStorage[environment.localstorage.spotify_access_token])
      return true;
    else
      return false;*/
  }

  authen(isLogin:boolean = false){
    const afterRoute = isLogin?"spotify-login":"spotify-success";
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${this.client_id}&redirect_uri=${environment.host_url}/${afterRoute}&scope=user-read-email%20playlist-read-private%20playlist-modify-public&response_type=token&state=1`;
  }

  parseUrl(url:string){
    let result = url.split('#')
    if(result.length > 1)
    {
      const rawParams = result[1].split('&');
      let params:{'access_token':string, 'token_type':string, 'expires_in':string, 'state':string} = {
        access_token:'',
        token_type:'',
        expires_in:'',
        state:''
      }; 
      rawParams.forEach(item => {
        const content = item.split('=');
        params[content[0]] = content[1];
      })
      return params;
    }else
      return null;
  }

  processSignin(url:string){
    const result = this.parseUrl(url);
    this.setTokenToLocal(result.access_token, result.expires_in);
    this.onAuthChange.emit({
      state:"signin",
      option:result
    });
    setTimeout(() => {
      this.onAuthChange.emit({state:"signout"});
    }, (Number(result.expires_in)*1000));
  }

  getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) ||
        [null, ''])[1].replace(/\+/g, '%20')) || null;
  }

  setTokenToLocal(accessToken:string, activeSecond:string){
    this.accessToken = accessToken;
    localStorage[ environment.localstorage.spotify_age ] = new Date().getTime();
    localStorage[ environment.localstorage.spotify_expire_in ] = activeSecond;
    localStorage[ environment.localstorage.spotify_access_token ] = accessToken;
  }

  getTokenLocal(){
    return localStorage[ environment.localstorage.spotify_access_token ]
  }

  clearToken(){
      this.onAuthChange.emit({state:"signout"});
      delete localStorage[ environment.localstorage.spotify_age ] ;
      delete localStorage[ environment.localstorage.spotify_expire_in ];
      delete localStorage[ environment.localstorage.spotify_access_token ];
  }

  getProfile(accessToken:string){
    return fetch(`https://api.spotify.com/v1/me`,{
      headers:{
        'Authorization':'Bearer ' + accessToken
      }
    }).then(res => res.json()).then(res => res as SpotifyUser)
  }

  getMyPlaylists(offset:number = 0){
    return fetch(`https://api.spotify.com/v1/me/playlists?offset=${offset}`,{
      headers:this.getHeaderOptions()
    }).then(res => res.json())
    .catch(e => this.clearToken())
      
  }

  getPlaylist( playlist_id:string){
      return fetch(`https://api.spotify.com/v1/playlists/${playlist_id}`,{
        headers:this.getHeaderOptions()
      }).then(res => res.json()).then(res => (res as SpotifyPlaylist))
      .catch(e => this.clearToken())
  }

  async getMyWholePlaylists(callback?:Function){
    let playlists:Array<SpotifyPlaylist> = [];
    let currentOffset = 0;
    let addNext = false;
    do{
      let stuff = await this.getMyPlaylists(currentOffset)
      addNext = stuff.total > currentOffset + stuff.limit
      //console.log(stuff.items, playlists)
      playlists = playlists.concat(stuff.items)
      if(callback)
        callback(playlists);
      currentOffset += stuff.items.length;
      
    }while(addNext);
   
    return playlists;
  }

  getAudioFeatures(ids: Array<string>){
    let raw_ids = ids.join(",");
    return fetch(`https://api.spotify.com/v1/audio-features?ids=${raw_ids}`, {
      headers:this.getHeaderOptions()
    }).then(res => res.json()).then(res => res.audio_features as Array<AudioFeature>);
  }

  async getArtists(ids: Array<string>, callback?:(partialArtists:Array<SpotifyArtist>)=>{} ){
    if(ids.length < 50){
        return fetch(`https://api.spotify.com/v1/artists?ids=${ids.join(',')}`, {
        headers: this.getHeaderOptions()
      } ).then(res => res.json()).then(res => (res.artists as Array<SpotifyArtist>))
    }else{
      //make array of ids
      let setIds:Array<Array<string>> = [];
      for(let index =0; index < ids.length; index += 50)
        setIds.push( ids.slice(index, index + 50 ) );
      let promiseSets = setIds.map(rawIds => fetch(`https://api.spotify.com/v1/artists?ids=${rawIds.join(',')}`, {
        headers: this.getHeaderOptions()
      } ).then(res => res.json()).then(res => (res.artists as Array<SpotifyArtist>)))
      console.log(promiseSets)
      let artists:Array<SpotifyArtist> = [];
      for(let i = 0; i< promiseSets.length; i++){
        let set = await promiseSets[i]
        
        artists = artists.concat(set);
        if(callback)
          callback(set)
      }
      return artists;
    }
    
  }

  async getPlaylistInformations(playlist:SpotifyPlaylist){
      let spotifyTrackIds = playlist.tracks.items.filter(item => !item.is_local).map(item => item.track.id)
       let djjamTracks = await Promise.all(spotifyTrackIds.map(id => this.trackService.get(id)));
       djjamTracks = djjamTracks.filter( track => track?true:false)
       let djjamIds =  djjamTracks.map(item => item.id)
       let nodataIds = spotifyTrackIds.filter(spotifyTrackId => {
          return djjamIds.findIndex(djjamId => djjamId == spotifyTrackId) === -1
       })
       let keyValue:{[key:string]:AudioFeature} = djjamTracks.map(item => item.audio_feature).reduce((prev, now) => {
        prev[now.id] = now
        return prev;
       }, {})
       
       let data = await this.getAudioFeatures(nodataIds)
       data.forEach(item => {
         if(item && item.id)
          keyValue[item.id] = item;
       })
       let djjamTrackKey:{[key:string]:Track} = djjamTracks.reduce((p, c) => {
         p[c.id] = c
        return p;
       }, {})
       return {
         djjamTracks:djjamTrackKey,
         audioFeatures:keyValue
       };
  }

  _processSpotifyTrackToBpm(item:SpotifyTrackItem,  djjamTracks?:{[key:string]:Track}, audioFeatures?:{[key:string]:AudioFeature}  ){
    if(djjamTracks && djjamTracks[item.track.id])
        return Math.round(djjamTracks[item.track.id].bpm);
    else if(audioFeatures && audioFeatures[item.track.id])
        return Math.round(audioFeatures[item.track.id].tempo < 100?audioFeatures[item.track.id].tempo *2:audioFeatures[item.track.id].tempo) ;      
    else
      return 0;
  }

  getTrackBpms(playlist:SpotifyPlaylist, djjamTracks:{[key:string]:Track}, audioFeatures:{[key:string]:AudioFeature} ){
    return playlist.tracks.items.filter(item => !item.is_local).map(item => this._processSpotifyTrackToBpm(item, djjamTracks, audioFeatures))
  }

  _processTagsToArrayTags(tags:{[key:string]:string} ){
    return Object.keys(tags).map(tagName => {
      if(DJJAM_MAIN_TAGS[tagName])
        return DJJAM_MAIN_TAGS[tagName]
      else
        return tagName
    })
  }

  _processSpotifyTrackToTags(item:SpotifyTrackItem,  djjamTracks?:{[key:string]:Track}, audioFeatures?:{[key:string]:AudioFeature} ){
    let tags:{[key:string]:string} ={};
    //add tag from DJ JAM
    Object.keys(DJJAM_MAIN_TAGS).forEach(tagName => {
      
      if(djjamTracks && djjamTracks[item.track.id] && djjamTracks[item.track.id].tags && djjamTracks[item.track.id].tags[tagName])
        tags[tagName] = DJJAM_MAIN_TAGS[tagName]
    })

    //add main tag that doest have from DJJAM (previous tag)
    if(audioFeatures && audioFeatures[item.track.id]){
      let audioFeature = audioFeatures[item.track.id]
      if(audioFeature.liveness >= 0.8 || audioFeature.speechiness >= 0.3)
        tags['live'] = DJJAM_MAIN_TAGS['live']
      if( audioFeature.valence >= environment.autotag.valence/environment.autotag.scale)
        tags['valence'] = DJJAM_MAIN_TAGS['valence']
      else
        tags['mellow'] = DJJAM_MAIN_TAGS['mellow']
      if( audioFeature.energy >= environment.autotag.energetic /environment.autotag.scale)
        tags['energetic'] = DJJAM_MAIN_TAGS['energetic']
      if(  audioFeature.instrumentalness >= 0.05)
        tags['nonvocal'] = DJJAM_MAIN_TAGS['nonvocal']
      else
        tags['vocal'] = DJJAM_MAIN_TAGS['vocal']
    }
    //sub tags
    if(djjamTracks && djjamTracks[item.track.id] && djjamTracks[item.track.id].tags){
      Object.keys(djjamTracks[item.track.id].tags)
        .filter(tagName => Object.keys(DJJAM_MAIN_TAGS).findIndex(mainTag => mainTag===tagName) == -1) //filter only not main tag
        .forEach(tagName => {
          tags[tagName] = tagName //add custom human tag
        })
    }
    return tags;
  }

  getTrackTags(playlist:SpotifyPlaylist, audioFeatures:{[key:string]:AudioFeature}, djjamTracks:{[key:string]:Track} ){
   let tagCount:{[key:string]:Array<SpotifyTrackItem>} = {
     'Instrusmental only':[],
     'Mellow':[],
     'Energetic':[],
     'Vocal':[],
     'Feel Good':[],
     'Live':[]
   }
    playlist.tracks.items.filter(item => !item.is_local).forEach(item => {
      let audioFeature = audioFeatures[item.track.id]
      let obj:any = {name:item.track.name, audio:audioFeature}//for testing      
      obj = item;
      if(audioFeature.liveness >= 0.8 || audioFeature.speechiness >= 0.3)
        tagCount['Live'].push(obj);
      if( audioFeature.valence >= environment.autotag.valence/environment.autotag.scale || (djjamTracks[item.track.id] && djjamTracks[item.track.id].tags && djjamTracks[item.track.id].tags['valence']))
        tagCount['Feel Good'].push(obj);
      else if( audioFeature.valence <= 0.55)
        tagCount['Mellow'].push(obj)
      if( audioFeature.energy >= environment.autotag.energetic /environment.autotag.scale  || (djjamTracks[item.track.id]&& djjamTracks[item.track.id].tags && djjamTracks[item.track.id].tags['energetic']))
        tagCount['Energetic'].push(obj);
      if(  audioFeature.instrumentalness >= 0.05 ||( djjamTracks[item.track.id]&& djjamTracks[item.track.id].tags && djjamTracks[item.track.id].tags['nonvocal']))
        tagCount['Instrusmental only'].push(obj);
      else
        tagCount['Vocal'].push(obj);
    })
    return tagCount;
  }

  getArtistsInfomation(playlist:SpotifyPlaylist){
    const artistCounts:{[key:string]:{name:string, id:string, count:number}} = {};
    playlist.tracks.items.filter(item => !item.is_local).forEach( item => {
      item.track.artists.forEach(artist => {
        if(!artistCounts[artist.id])
          artistCounts[artist.id] = { name: artist.name, id:artist.id, count:0}
        artistCounts[artist.id].count += 1;
      })  
    })
    
    return artistCounts;
  }

  getHeaderOptions(){
    if(!this.accessToken)
      this.accessToken = this.getTokenLocal();
    if(!this.tokenType)
      this.tokenType = "Bearer";
    //console.log('header token', this.accessToken)
    return {
      'Authorization':this.tokenType + ' ' + this.accessToken
    }
    
  }

}

