import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {ClientService} from '../../services/client.service';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-client-transfer-money',
  templateUrl: './client-transfer-money.component.html',
  styleUrls: ['./client-transfer-money.component.css']
})
export class ClientTransferMoneyComponent implements OnInit {

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
          from_bank_account: ['',''],
          to_bank_account: ['',''],
          amount: ['','']
        })
    }

  formEnable(){
    this.form.get('from_bank_account').enable();
    this.form.get('to_bank_account').enable();
    this.form.get('amount').enable();
  }
  formDisable(){
    this.form.get('from_bank_account').disable();
    this.form.get('to_bank_account').disable();
    this.form.get('amount').disable();
  }


  onTransferSubmit(){

    this.processing = true;
    this.formDisable();


    var from_bank_account= this.form.controls.from_bank_account.value;
    var to_bank_account= this.form.controls.to_bank_account.value;
    var amount= this.form.controls.amount.value;


    this.clientService.transferMoney(this.token,from_bank_account, to_bank_account,amount).subscribe((data)=> {
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
  }

}
