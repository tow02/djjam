export interface ElasticTrack{
  artists:Array<string>,
  bpm:number,
  duration:number,
  id:string,
  name:string,
  personal_tags:Array<string>,
  tags:Array<string>,
  year:string
}

export interface ElasticSearch {
    took:number,
    timed_out:boolean,
    hits:{
      hits:Array<{
        _id:string,
        _index:string,
        _score:number,
        _type:string,
        _source:ElasticTrack
      }>,
      max_score:number,
      total:number
    }
  }
  