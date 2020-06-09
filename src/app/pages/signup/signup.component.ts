import { Component, OnInit } from '@angular/core';
import {  FormBuilder, Validators } from '@angular/forms';
import { UserService, User } from "../../services/user.service"
import { ConfirmPasswordValidator } from "./confirm-password.validator"
import { filterByCityName } from "filterbycities"

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  profileForm  =  this.formBuilder.group({
    email:['', [Validators.required, Validators.email]],
    djName:['', [Validators.required, Validators.minLength(5)] ],
    communityName: ['', [Validators.required, Validators.minLength(5)]],
    cityName: ['', [Validators.required, Validators.minLength(3)]],
    password:['', [Validators.required, Validators.minLength(8)]],
    confirmPassword:['', [Validators.required, Validators.minLength(8)]]
  }, { validators: ConfirmPasswordValidator.MatchPassword })
  constructor(private userService:UserService, private formBuilder:FormBuilder) {
     
  }
  options:Array<string> = [];

  ngOnInit(): void {

    this.profileForm.valueChanges.subscribe(val => {
      
      this.options = filterByCityName(val.cityName)
      
    })    
  }

  get djName(){
    return this.profileForm.get('djName');
  }

  get email(){
    return this.profileForm.get('email')
  }

  get communityName(){
    return this.profileForm.get('communityName')
  }

  get cityName(){
    return this.profileForm.get('cityName')
  }

  get password(){
    return this.profileForm.get("password");
  }

  get confirmPassword(){
    return this.profileForm.get("confirmPassword");
  }

  onSubmit(){
    console.log(this.profileForm.errors);
    console.log(this.profileForm.value);
  }

}
