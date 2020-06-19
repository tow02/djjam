import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { ElasticSearch } from "../models/Elastic"
import { transformHumanQueryToElasticQuery } from "../utilities/track.utilities"
import { AuthenticationService } from "../services/authentication.service"

export interface FilterOptions{
  type?:{
    [key:string]:string
  },
  tempo?:{
    from?:number,
    to?:number
  },
  duration:{
    from?:number,
    to?:number
  }
}


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

  async search(query:string,  from:number =0, size:number = 20, options?:FilterOptions){
    let q = query
    if(options){
      if(options.tempo){
        const from = options.tempo.from?options.tempo.from:0;
        const to = options.tempo.to?options.tempo.to:999;
        q += ` bpm:[${from} TO ${to}]`;
      }
      if(options.duration){
        const from = options.duration.from?options.duration.from:0;
        const to = options.duration.to?options.duration.to:600000
        q += ` duration:[${from} TO ${to}]`;
      }
      if(options.type){
        const uid =  (await this.authen.auth.currentUser).uid ;
        Object.keys(options.type).forEach((typeName, index) => {
          if(index > 0)
            q += " AND"
          if(uid)
            q += `(tags:${typeName} OR (personal_tags:${typeName}^100 AND personal_tags:${uid} ))`
          else
          q += `(tags:${typeName})`
        })
      }
    }
    return this.queryTrack(q, from, size);
    
  }
  

}
