import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
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
  client_secret = environment.client_secret;



  //private authorizeCode:string;
  private accessToken: any;
  private tokenType: string;

  constructor( private router:Router) { }

  isConnect(){
    if(this.accessToken && this.tokenType)
      return true;
    else if(localStorage[environment.localstorage.spotify_access_token])
      return true;
    else
      return false;
  }

  getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) ||
        [null, ''])[1].replace(/\+/g, '%20')) || null;
  }

  setTokenToLocal(accessToken:string){
    this.accessToken = accessToken;
    localStorage[ environment.localstorage.spotify_age ] = new Date().getTime();
    localStorage[ environment.localstorage.spotify_access_token ] = accessToken;
  }

  setRefreshToLocal(refreshToken:string){
    
    localStorage[ environment.localstorage.refresh_token ] = refreshToken;
  }

  getTokenLocal(){
    return localStorage[ environment.localstorage.spotify_access_token ]
  }

  refreshToken(current_url:string){
    localStorage[ environment.localstorage.spotify_redirect_url]  = current_url;
    window.location.href = environment.host_url + "/redirect"
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

  getHeaderOptions(){
    if(!this.accessToken)
      this.accessToken = this.getTokenLocal();

    
    if(!this.tokenType)
      this.tokenType = "Bearer";

    return {
      'Authorization':this.tokenType + ' ' + this.accessToken
    }
    
  }

}

