import { Component, HostListener  } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'djjam-v2';

  isOpen = true;
  mode:"desktop"|"mobile" = "mobile";

  constructor(){
    if(window.innerWidth < 800)
      this.isOpen = false;
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
      if (event.target.innerWidth < 800) {
          if(this.mode == "desktop")
            this.isOpen = false;
          this.mode = "mobile"
      }else{
        if(this.mode == "mobile")
          this.isOpen = true;
        this.mode = "desktop";
      }
        
  }
  toggleMenu(){
    this.isOpen = !this.isOpen;
  }
}
