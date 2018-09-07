import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {TellerService} from '../../services/teller.service';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-teller-change-pwd',
  templateUrl: './teller-change-pwd.component.html',
  styleUrls: ['./teller-change-pwd.component.css']
})
export class TellerChangePwdComponent implements OnInit {

    token;
    form;
    processing;

    error;
    constructor(private formBuilder: FormBuilder,
                private location: Location,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private authService: AuthService,
                private tellerService: TellerService) {

                  this.authService.loadData();
                  if(this.authService.login_token == null || this.authService.user_type != 2){
                    this.router.navigate(['/login']);
                  }

                  if(this.authService.isNewPassword == 0){
                    this.router.navigate(['/teller-home']);
                  }

                  this.token = this.authService.login_token;
                  this.createTransferForm();
    }


    createTransferForm(){
      this.form = this.formBuilder.group({
        account_password: ['','']
      })
    }
    formEnable(){
      this.form.get('account_password').enable();

    }
    formDisable(){
      this.form.get('account_password').disable();
    }


    onTransferSubmit(){

      this.processing = true;
      this.formDisable();


      var account_password= this.form.controls.account_password.value;


      this.tellerService.changePwd(this.token,account_password).subscribe((data)=> {
        console.log(data);
        this.formEnable();
        this.processing = false;

        this.authService.isNewPassword = false;
        this.authService.saveData();
        this.router.navigate(['/teller-home'])

      },(errs)=>{

        this.formEnable();
        this.processing = false;

        this.error = JSON.parse(errs._body).message;

        console.log("Error");
        console.log(errs);
        var errBody = JSON.parse(errs._body)
        if(errBody.auth_problem){
            this.authService.logout();
            this.router.navigate(['/login']);
        }
      })
    }
    ngOnInit() {
    }


}
