import { Component, OnInit } from '@angular/core';
import {  FormBuilder, Validators } from '@angular/forms';
import { UserService, User } from "../../services/user.service"
import { filterByCityName } from "filterbycities"

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  profileForm  =  this.formBuilder.group({
    email:['', Validators.email],
    djName:['', Validators.required ],
    communityName: ['',Validators.minLength(5)],
    cityName: ['',Validators.minLength(5)],
    password:['', Validators.minLength(8)],
    repassword:['', Validators.minLength(8)]
  })
  constructor(private userService:UserService, private formBuilder:FormBuilder) {
     
  }
  options:Array<string> = [];

  ngOnInit(): void {

    this.profileForm.valueChanges.subscribe(val => {
      
      this.options = filterByCityName(val.cityName)
      
    })    
  }

  onSubmit(){
    console.log(this.profileForm.errors);
    console.log(this.profileForm.value);
  }

}
