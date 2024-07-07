import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  ɵConsole,
} from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css'],
})
export class SearchboxComponent implements OnInit {
  @Input()
  query: string;

  @ViewChild('searchq')
  private searchq: ElementRef;

  constructor() {}

  ngOnInit(): void {
    console.log('search box baby');
    //document.getElementById('query').setAttribute("value", this.query);
  }

  search() {
    //this.query = document.getElementById('query').getAttribute('value');
    window.location.href = `${environment.host_url}/search/${this.query}`;
  }

  public ngAfterViewInit(): void {
    console.log('afterr q?', this.searchq.nativeElement);
    setTimeout(() => {
      this.searchq.nativeElement.focus();
    }, 100);
  }
}
