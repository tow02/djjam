import { environment } from "../../environments/environment"
  function _nameSearch(original_tracks:Array<any>, q: string){
    return  original_tracks.filter(track => {
      return (track.name as string).toLowerCase().indexOf(q.toLowerCase()) >= 0
    })
  }

  function _artistSearch(original_tracks:Array<any>, q: string){
    return  original_tracks.filter(track => {
     // return (track.name as string).toLowerCase().indexOf(q.toLowerCase()) >= 0
      return (track.artists as Array<any>).filter(artist => {
        return (artist.name as string).toLowerCase().indexOf(q.toLowerCase()) >= 0
      }).length > 0
    })
  }

  function _getBpmRange(q:string) {
    let double_reg = /bpm\s\d+-\d+/
    if(!q.match(double_reg))
      return null;
    let _bpm:string = q.match(double_reg)[0];
    let result = _bpm.match(/\d+/g)
    let from = Number(result[0])
    let to = Number(result[1]);
    return {
      from:from,
      to:to
    }
  }

  function _bpmSearch(original_tracks:Array<any>, q: string){
    //let single_reg = /bpm\s\d+/
   let realData = _getBpmRange(q)
   
   return original_tracks.filter(track => {
      if(!track.bpm || !realData)
        return false;
      return  track.bpm >= realData.from && track.bpm <= realData.to;
    });
    
  }

  function _tagSearch(original_tracks:Array<any>, q: string){
    return  original_tracks.filter(track => {
      if(!track.tags)
        return false;
      if(!track.tags[q.toLocaleLowerCase()])
        return false;
      return track.tags[q.toLocaleLowerCase()];
    });
    /*return  original_tracks.filter(track => {
      if(!track.tags)
        return false;
      return track.tags.findIndex(t => {
        return t == q.toLowerCase();
      }) >= 0;
    });*/
  }


export function batchAddTag(tracks:Array<any>, tag:string){
  
  /*tracks.forEach( item => {
    if(!item.tags)
      item.tags = [];
    let isTagged  = findTagIndex(item, tag) >= 0 ;
    if(!isTagged)
      item.tags.push(tag)
  })*/
  tracks.forEach( item => {
    if(!item.tags)
      item.tags = {};
    item.tags[tag] = true;

  });
  
  return tracks;
}

export function batchUnTag(tracks:Array<any>, tag:string){
  
  tracks.forEach( item => {
    if(item.tags && item.tags[tag])
      delete item.tags[tag];
    
  });
  return tracks;
}

function _getTagsQuery(q:string, isExcluded:boolean = false ){
  let command_regex;
  if(isExcluded)
    command_regex = /exclude\s"[\w\d\s,]+"/
  else
    command_regex = /tag\s"[\w\d\s,]+"/
  if(!q.match(command_regex))
      return [];
  let _tags:string = q.match(command_regex)[0]; 
  let reg2 = _tags.match(/"[\w\d\s,]+"/)[0]
  console.log(reg2);
  console.log('after_tag')
  let tags = reg2.match(/[^,^"]+/g).filter( text => {return text.length > 0});
  return tags;
}

function specificTagsSearch(original_tracks:Array<any>, q, isExcluded:boolean = false){
  console.log('_TagSearch')
  
  let tags = _getTagsQuery(q, isExcluded);
  console.log('exclude tags', tags)

  let stupid_tracks = [];
  if(isExcluded)
    tags.forEach(tag => {
        stupid_tracks = stupid_tracks.concat(_tagSearch(original_tracks, tag));
    })
  else{
    let result_tags = [];
    tags.forEach(tag => {
      result_tags.push(_tagSearch(original_tracks, tag));
    });
    //intersec all
    stupid_tracks = result_tags.reduce((prevTerm, currentTerm, index ) => {
      let tracks = [];
          (prevTerm as Array<any>).forEach( track => {
            let intersectIndex = (currentTerm as Array<any>).findIndex(track2 => {
                return track2.id == track.id
            })
            if(intersectIndex >=0 )
              tracks.push(track);
          })
          return tracks
    })
  }
  //
  return stupid_tracks;
}

function excludeCommand(q:string){
  let command_regexs = [/bpm\s\d+-\d+/, /exclude\s"[\w\d\s,]+"/, /tag\s"[\w\d\s,]+"/]
    let filter_q = q;
    command_regexs.forEach(regex => {
      if(q.match(regex))
        filter_q = filter_q.replace(q.match(regex)[0],"")
    })
  return filter_q
}

export function searchTrack(original_tracks:Array<any>, q:string){
    if(!q)
      return original_tracks 
    //
    //this.q = q;
    
    //get command result first
    let bpm_result = _bpmSearch(original_tracks, q) ;
    let exclude_result = specificTagsSearch(original_tracks, q, true)
    let tags_result = specificTagsSearch(original_tracks, q);
    console.log('exclude', exclude_result)
    
    let filter_q = excludeCommand(q)
    console.log('pure q :', filter_q)
    //do normal search
    let terms = filter_q.split(' ');
    let _terms = []
    terms.forEach((term, index) => {
      let _result = [];
      _result.push(_nameSearch(original_tracks, term))
      _result.push(_artistSearch(original_tracks, term))
      _result.push(_tagSearch(original_tracks, term))
      let _merge:any = {};
      _result.forEach(result => {
        (result as Array<any>).forEach( track => {
          _merge[track.id] = track;
        })
        _terms[index] = [];
        for(let key in _merge)
            _terms[index].push(_merge[key]);
        })
    })
    //add command search
    if(bpm_result.length > 0)
      _terms.push(bpm_result)
    if(tags_result.length > 0)
      _terms.push(tags_result);
    //merge all search result
    //merge term
    let result = [];
    if(_terms.length > 1)
      result = _terms.reduce((prevTerm, currentTerm, index ) => {
          let tracks = [];
          (prevTerm as Array<any>).forEach( track => {
            let intersectIndex = (currentTerm as Array<any>).findIndex(track2 => {
                return track2.id == track.id
            })
            if(intersectIndex >=0 )
              tracks.push(track);
          })
          return tracks
        })
    else if(_terms.length == 1){
      result = _terms[0]
    }
    //exclude time
    
    let result2 = result.filter(track => {
        if(exclude_result.filter(t  => {
            return t.id == track.id
        }).length > 0){
            return false;
        }else
            return true;

    })

    return result2;
}


export function getBpmDataRange(tracks:Array<any>){
  let bpm_data_range: Array<{name:string, percent:number, min:number, max:number}> = [];
  environment.analytics.rangeNames.forEach(item => {
    let count = tracks.filter(t => {
      return t.bpm >= item.bpmMin && t.bpm < item.bpmMax
    }).length
    bpm_data_range.push({ name: item.name, percent: Math.floor(count/tracks.length*10000)/100, min:item.bpmMin, max:item.bpmMax})
    
  })
  return bpm_data_range;
}


export function getTempoMetaData(tracks:Array<any>){
  let obj = { duration:0, duration_average:0, bpm_average:0, eight_count_per_song_average:0 };
  let bpm_sum = 0;
  let duration_sum = 0;
  tracks.forEach(t => {
    obj.duration += t.duration;
    bpm_sum += t.bpm;
  })

  obj.bpm_average = bpm_sum / tracks.length;
  obj.duration_average = obj.duration/ tracks.length;
  obj.eight_count_per_song_average = obj.duration_average/60000 *obj. bpm_average / 8;
  return obj;
}


export function transformToTracks(elasticResult:any){
  return {
    total: elasticResult.hits.total,
    tracks: (elasticResult.hits.hits as Array<any>).map(item => item._source)
  }
}


export function transformHumanQueryToElasticQuery(humanQuery:string, user_id_token:string){
  let q = "";
  let bpmQ = _getBpmRange(humanQuery)
  if(bpmQ)
    q += `bpm:[${bpmQ.from} TO ${bpmQ.to}]`
  let mustHaveTags = _getTagsQuery(humanQuery);
  if(mustHaveTags && mustHaveTags.length > 0)
    mustHaveTags.forEach((tag, index)=>{
      if(index > 0 || bpmQ)
        q += ` AND `
      q += `(tags:${tag} OR (personal_tags:${tag}^100 AND personal_tags:${user_id_token} ))`
    })
  let mustNotHaveTags = _getTagsQuery(humanQuery, true);
  let exq = '';
  if(mustNotHaveTags && mustNotHaveTags.length > 0){
    mustNotHaveTags.forEach((tag, index)=>{
      if(index > 0 )
        exq += ` OR `
      exq += `(tags:${tag} OR (personal_tags:${tag} AND personal_tags:${user_id_token} ))`
    })
    if((mustHaveTags && mustHaveTags.length > 0 ) || bpmQ)
      q += ' AND '
    q += ` NOT (${exq})`
  }
  // normal search
  let normal_q = '';
  let filter_q = excludeCommand(humanQuery)
  //normal_q = filter_q;
  console.log('pure q :', filter_q)
  
  let terms = filter_q.split(' ');

  terms.filter(item => item != '' ).forEach((term, index) => {
    
      if(index > 0)
        normal_q += ' AND '
      normal_q += `(artists:${term} OR name:${term} OR tags:${term} OR (personal_tags:${term}^100 AND personal_tags:${user_id_token} ))`
  
    
  })



  if((mustNotHaveTags && mustNotHaveTags.length > 0) || (mustHaveTags && mustHaveTags.length > 0) || bpmQ ){
   if(normal_q && normal_q.length > 0)
    q += ` AND ${normal_q}`   
  }else
    q = normal_q;


  return q;
}