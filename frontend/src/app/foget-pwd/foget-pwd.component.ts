import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../services/auth.service';
import 'rxjs/add/operator/catch';


@Component({
  selector: 'app-foget-pwd',
  templateUrl: './foget-pwd.component.html',
  styleUrls: ['./foget-pwd.component.css']
})
export class FogetPwdComponent implements OnInit {


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
      nid: ['','']
    })
  }


formEnable(){
  this.form.get('nid').enable();
}
formDisable(){
  this.form.get('nid').disable();
}

onLoginSubmit(){

    this.processing = true;
    this.formDisable();

    var nid =  this.form.controls.nid.value;

    this.authService.forgetpwd(nid).subscribe((data)=> {
      console.log(data);
      this.formEnable();
      this.processing = false;

      this.authService.logout();
      this.router.navigate(['/login']);


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
