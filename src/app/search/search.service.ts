import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { ElasticSearch } from "../models/Elastic"
import { transformHumanQueryToElasticQuery } from "../utilities/track.utilities"
import { AuthenticationService } from "../services/authentication.service"

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  
  constructor( private authen:AuthenticationService) {
      
   }
  

  queryTrack( q:string = "*" , from:number = 0, size:number = 20){
    let url = environment.search_url + `?q=${q}&from=${from}&size=${size}`;
    console.log(url);

    return fetch(url).then(res => res.json()).then(res => res as ElasticSearch);
    //return this.http.get(url).pipe(obj => obj as Observable<ElasticSearch>);
    
    
  }

  async query(humanQuery:string, from:number =0, size:number = 20){

    return this.queryTrack(transformHumanQueryToElasticQuery(humanQuery, (await this.authen.auth.currentUser).uid ), from, size);
  }
  

}
