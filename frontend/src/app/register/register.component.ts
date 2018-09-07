import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../services/auth.service';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  form;
  processing;
  constructor(private formBuilder: FormBuilder,
              private location: Location,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private authService: AuthService) {

                this.createNewAccountForm();
               }


   createNewAccountForm(){
       this.form = this.formBuilder.group({
         name: ['',''],
         username: ['',''],
         password: ['',''],
         nid: ['',''],
         bank_account: ['',''],
         phone: ['',''],
         email: ['','']
       })
   }


   formEnable(){
     this.form.get('name').enable();
     this.form.get('username').enable();
     this.form.get('password').enable();
     this.form.get('nid').enable();
     this.form.get('bank_account').enable();
     this.form.get('phone').enable();
     this.form.get('email').enable();
   }
   formDisable(){
     this.form.get('name').disable();
     this.form.get('username').disable();
     this.form.get('password').disable();
     this.form.get('nid').disable();
     this.form.get('bank_account').disable();
     this.form.get('phone').disable();
     this.form.get('email').disable();
   }


   onCreateAccountSubmit(){


     this.processing = true;
     this.formDisable();


     var name= this.form.controls.name.value;
     var username= this.form.controls.username.value;
     var password= this.form.controls.password.value;
     var nid= this.form.controls.nid.value;
     var bank_account= this.form.controls.bank_account.value;
     var phone= this.form.controls.phone.value;
     var email= this.form.controls.email.value;



     var user = {
       applicant_username : username,
       applicant_password: password,
       applicant_name: name,
       applicant_phone_number: phone,
       applicant_email: email,
       applicant_national_id:nid ,
       applicant_bank_account: bank_account
     }

     this.formEnable();
     this.processing = false;

       this.authService.registerUser(user).subscribe((data)=> {

         console.log(data);
         this.formEnable();
         this.processing = false;

         this.router.navigate(['/login'])

       },(errs)=>{

         console.log("Error");
         console.log(errs);
         var errBody = JSON.parse(errs._body)
         console.log(errBody);
         if(errBody.auth_problem){
             this.authService.logout();
             this.router.navigate(['/login']);
         }

       })

   }


  ngOnInit() {
  }

}
