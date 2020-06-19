import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FilterOptions } from "../search.service"


@Component({
  selector: 'search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})
export class SearchFilterComponent implements OnInit {

  @Output()
  onUpdateFilter:EventEmitter<FilterOptions> = new EventEmitter<FilterOptions>();

  constructor() { }

  TYPES:Array<{
    name:string,
    value:string,
    selected:boolean
  }> = [
    {name:"MODERN", value:"modern", selected:false},
    {name:"CLASSIC", value:"classic", selected:false},
    {name:"BLUES", value:"blues", selected:false},
    {name:"NEW ORLEANS", value:"dixie", selected:false},
    {name:"SOUL", value:"soul", selected:false},
  ]

  TEMPOS:Array<{
    name:string,
    from?:number,
    to?:number,
    selected:boolean
  }> = [
    { name:"SUPER SLOW",from:0, to:105, selected:false},
    { name:"SLOW",from:105, to:135, selected:false},
    { name:"MEDIUM",from:135, to:165, selected:false},
    { name:"FAST",from:165, to:195, selected:false},
    { name:"SUPER FAST", from:195, to:999, selected:false},
  ]

  DURATIONS:Array<{
    name:string,
    from?:number,
    to?:number,
    selected:boolean
  }> = [
    { name:"SHORT (< 3 minutes)", from:0, to:3*1000*60, selected:false},
    { name:"MEDIUM (< 4 minutes)",from:3*1000*60, to:4*1000*60, selected:false},
    { name:"LONG (> 4 minutes)",from:4*1000*60, to:100*1000*60, selected:false}
  ]

  select(key:string, index:number){
    if(key == 'TYPES'){
      this[key][index].selected = !this[key][index].selected ;
    }else{
      let prev_index = this[key].findIndex(item => item.selected);
      if(prev_index != index){
        this[key].forEach(item => item.selected = false);
        this[key][index].selected = true;
      }else
        this[key][index].selected = false;    
    }
    this.updateFilter();
  }

  updateFilter(){
    let options: FilterOptions = {};
    let tempo = this.TEMPOS.find(item => item.selected)
    if(tempo)
      options.tempo = {
        from:tempo.from,
        to:tempo.to
      }
    let duration = this.DURATIONS.find(item => item.selected)
    if(duration)
      options.duration = {
        from:duration.from,
        to:duration.to
      }
    let types = this.TYPES.filter(item => item.selected)
    if(types.length > 0)
      options.type = {};
    types.forEach(type => {
      options.type[type.value] = type.name
    })
    //console.log('filter options', options)
    this.onUpdateFilter.emit(options);
  }


  ngOnInit(): void {
    console.log(this.TYPES)
  }

}
