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

  authen(){
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${this.client_id}&redirect_uri=http://localhost:4200/spotify-success&scope=user-read-email%20playlist-read-private%20playlist-modify-public&response_type=token&state=1`;
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
    /*localStorage[ environment.localstorage.spotify_redirect_url]  = current_url;
    window.location.href = environment.host_url + "/redirect"*/
    return fetch(`https://accounts.spotify.com/api/token`, {
      method:"POST",
      headers:{
        'Authorization':`Basic NWEyYmMwYzNkOGI1NDM3MGFlYjYxYzcxYjAyOTI5NmY6ODM1YjFjZmUxMzM2NDdkZGI5NzgwMTU1ZmI2ZjVjMTU=`
      },
      body:`grant_type=refresh_token&refresh_token=${this.refreshToken}`
    })
    //AQAD6cNKO1QPyK5Wo3-TCowjHw9qJXCB9FqPp7cALVZUs1qbeoLkFlPmxmnuJhRl1Emrf6VT7nA4BCSuNw7_MpM6c-Jviydn2zFPqelJWYcy8A12owuCHCXLJSix0cQUNHs
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

