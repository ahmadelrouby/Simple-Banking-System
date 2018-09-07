import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {ClientService} from '../../services/client.service';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-client-update-info',
  templateUrl: './client-update-info.component.html',
  styleUrls: ['./client-update-info.component.css']
})
export class ClientUpdateInfoComponent implements OnInit {

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

                if(this.authService.isNewPassword == 1){
                this.router.navigate(['/client-change-pwd']);
                }

                this.token = this.authService.login_token;
                this.createTransferForm();
  }

  createTransferForm(){
        this.form = this.formBuilder.group({
          phone: ['',''],
          email: ['','']
        })
    }


    formEnable(){
      this.form.get('phone').enable();
      this.form.get('email').enable();
    }
    formDisable(){
      this.form.get('email').disable();
      this.form.get('phone').disable();
    }


    onTransferSubmit(){

      this.processing = true;
      this.formDisable();


      var phone= this.form.controls.phone.value;
      var email= this.form.controls.email.value;


      this.clientService.updateInfo(this.token,phone, email).subscribe((data)=> {
        console.log(data);
        this.formEnable();
        this.processing = false;

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

    this.clientService.getClientData(this.token).subscribe((data)=> {

      this.form.controls['phone'].setValue(data.user_data.phone);
      this.form.controls['email'].setValue(data.user_data.email);


    },(errs)=>{

      var errBody = JSON.parse(errs._body)
      if(errBody.auth_problem){
          this.authService.logout();
          this.router.navigate(['/login']);
      }

    })

  }

}
