import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {TellerService} from '../../services/teller.service';
import 'rxjs/add/operator/catch';


@Component({
  selector: 'app-teller-new-account',
  templateUrl: './teller-new-account.component.html',
  styleUrls: ['./teller-new-account.component.css']
})
export class TellerNewAccountComponent implements OnInit {


  id;
  type;

  token;
  form;
  processing;
  currencies;

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

                if(this.authService.isNewPassword == 1){
                this.router.navigate(['/teller-change-pwd']);
              }


                this.token = this.authService.login_token;
                this.createNewAccountForm();
              }

  createNewAccountForm(){
      this.form = this.formBuilder.group({
        client_nid: ['',''],
        currency_name: ['','']
      })
  }

  formEnable(){
    this.form.get('client_nid').enable();
    this.form.get('currency_name').enable();
  }
  formDisable(){
    this.form.get('client_nid').disable();
    this.form.get('currency_name').disable();
  }



    onCreateAccountSubmit(){


      this.processing = true;
      this.formDisable();


      var client_nid= this.form.controls.client_nid.value;
      var currency_name= this.form.controls.currency_name.value;

      console.log(client_nid, currency_name, this.id.type);

      this.formEnable();
      this.processing = false;

        this.tellerService.createAccount(this.token,client_nid,this.id.type,currency_name).subscribe((data)=> {

          console.log(data);
          this.formEnable();
          this.processing = false;

          this.router.navigate(['/teller-home'])

        },(errs)=>{

          console.log("Error");
          console.log(errs);
          this.error = JSON.parse(errs._body).message;

          var errBody = JSON.parse(errs._body)
          console.log(errBody);
          if(errBody.auth_problem){
              this.authService.logout();
              this.router.navigate(['/login']);
          }

        })

    }


  ngOnInit() {
    this.id  = this.activatedRoute.snapshot.params;

    if(this.id.type !== 'savings' && this.id.type !== 'current')
      this.router.navigate(['teller-home'])

    this.type = (this.id.type == 'current')? 'Current' : 'Savings';

    this.tellerService.getCurrencies(this.token).subscribe((data)=> {

      console.log(data);
      this.formEnable();
      this.processing = false;
      this.currencies = data.currencies;

    },(errs)=>{

      console.log("Error");
      console.log(errs);
      var errBody = JSON.parse(errs._body)
      if(errBody.auth_problem){
          this.authService.logout();
          this.router.navigate(['/login']);
      }

    })
  }



}
