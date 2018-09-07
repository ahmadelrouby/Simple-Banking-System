import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../services/auth.service';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form;
  processing;

  error;

  constructor(private formBuilder: FormBuilder,
              private location: Location,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private authService: AuthService) {
                this.createLoginForm();
                this.authService.loadData();
                if(this.authService.login_token != null && this.authService.login_token != undefined ){
                  this.router.navigate(['/home']);
                }
              }

  createLoginForm(){
      this.form = this.formBuilder.group({
        username: ['',''],
        account_password: ['','']
      })
  }

  formEnable(){
    this.form.get('username').enable();
    this.form.get('account_password').enable();
  }
  formDisable(){
    this.form.get('username').disable();
    this.form.get('account_password').disable();
  }
  navigate(user_role){
    if(user_role == 3)
      this.router.navigate(['/admin-home'])
    else if(user_role == 2)
      this.router.navigate(['/teller-home'])
    else if(user_role == 1)
      this.router.navigate(['/client-home'])
  }
  onLoginSubmit(){

      this.processing = true;
      this.formDisable();

      var loginUser = {
        username: this.form.controls.username.value,
        password: this.form.controls.account_password.value
      }

      console.log(loginUser);

      this.authService.loginUser(loginUser).subscribe((data)=> {
        console.log(data);
        this.formEnable();
        this.processing = false;

        this.authService.saveUserData(data);
        // this.navigate(data.data.user_role);
        this.router.navigate(['/home']);


      },(errs)=>{
        this.error = JSON.parse(errs._body).message;
        console.log(this.error);

        // console.log(JSON.parse(errs._body));
        this.formEnable();
        this.processing = false;
        // console.log(data);
      })

  }
  ngOnInit() {
  }

}
