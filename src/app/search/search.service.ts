import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { ElasticSearch } from "../models/Elastic"
import { transformHumanQueryToElasticQuery } from "../utilities/track.utilities"

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http:HttpClient) { }

  queryTrack( q:string = "*" , from:number = 0, size:number = 20){
    let url = environment.search_url + `?q=${q}&from=${from}&size=${size}`;
    console.log(url);

    return fetch(url).then(res => res.json()).then(res => res as ElasticSearch);
    //return this.http.get(url).pipe(obj => obj as Observable<ElasticSearch>);
    
    
  }

  query(humanQuery:string, from:number =0, size:number = 20){
    return this.queryTrack(transformHumanQueryToElasticQuery(humanQuery, "29Nw9XgdbbWedz2ZTt13a2Zsgy42"), from, size);
  }
  

}
