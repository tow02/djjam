import { Injectable, EventEmitter } from '@angular/core';
import { environment } from "../../environments/environment"

interface SpotifyPlaylist{
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
  tracks: {href: string, items: Array<any>, limit: number, next: any, offset: number, previous:any, total:number}
  type: string
  uri: string
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

  constructor( ) { }

  isConnect(){
    if(localStorage[environment.localstorage.spotify_expire_in] && localStorage[environment.localstorage.spotify_access_token] && localStorage[environment.localstorage.spotify_age]){
      
      let now = new Date().getTime()
      console.log('exist', now, Number(localStorage[environment.localstorage.spotify_age]), now-Number(localStorage[environment.localstorage.spotify_age]))
      if(now - Number(localStorage[environment.localstorage.spotify_age]) <= Number(localStorage[environment.localstorage.spotify_expire_in])*1000)
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

  authen(){
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${this.client_id}&redirect_uri=http://localhost:4200/spotify-success&scope=user-read-email%20playlist-read-private%20playlist-modify-public&response_type=token&state=1`;
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

  setRefreshToLocal(refreshToken:string){
    
    localStorage[ environment.localstorage.refresh_token ] = refreshToken;
  }

  getTokenLocal(){
    return localStorage[ environment.localstorage.spotify_access_token ]
  }


  getMyPlaylists(offset:number = 0){
    return fetch(`https://api.spotify.com/v1/me/playlists?offset=${offset}`,{
      headers:this.getHeaderOptions()
    }).then(res => res.json())
      
  }

  getPlaylist( playlist_id:string){
      return fetch(`https://api.spotify.com/v1/playlists/${playlist_id}`,{
        headers:this.getHeaderOptions()
      }).then(res => res.json()).then(res => (res as SpotifyPlaylist));
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

  swapToken(){

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

