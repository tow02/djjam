import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { environment } from "../../environments/environment"

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

  async getMyWholePlaylists(offset:number = 0){
    let playlists = [];
    let currentOffset = 0;
    let addNext = false;
    do{
      let stuff = await this.getMyPlaylists(currentOffset)
      addNext = stuff.total > stuff.offset + stuff.limit
      console.log(stuff.items)
      playlists = playlists.concat(stuff.items)
    }while(addNext);
   
    return playlists;
  }

  getHeaderOptions(){
    if(!this.accessToken)
      this.accessToken = this.getTokenLocal();

    console.log(this.accessToken);
    console.log(this.tokenType);
    if(!this.tokenType)
      this.tokenType = "Bearer";

    return {
      'Authorization':this.tokenType + ' ' + this.accessToken
    }
    
  }

}

