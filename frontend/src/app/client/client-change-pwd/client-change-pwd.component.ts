import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {ClientService} from '../../services/client.service';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-client-change-pwd',
  templateUrl: './client-change-pwd.component.html',
  styleUrls: ['./client-change-pwd.component.css']
})
export class ClientChangePwdComponent implements OnInit {


  token;
  form;
  processing;
  error;
  constructor(private formBuilder: FormBuilder,
              private location: Location,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private clientService: ClientService) {

                this.authService.loadData();
                if(this.authService.login_token == null ||(this.authService.user_type != 1 && this.authService.client_nid == null) ){
                  this.router.navigate(['/login']);
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


    this.clientService.changePwd(this.token,account_password).subscribe((data)=> {
      console.log(data);
      this.formEnable();
      this.processing = false;

      this.authService.isNewPassword = 0;
      this.authService.saveData();
      this.router.navigate(['/client-home'])

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
