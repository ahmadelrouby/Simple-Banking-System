import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {TellerService} from '../../services/teller.service';
import 'rxjs/add/operator/catch';


@Component({
  selector: 'app-teller-new-transaction',
  templateUrl: './teller-new-transaction.component.html',
  styleUrls: ['./teller-new-transaction.component.css']
})
export class TellerNewTransactionComponent implements OnInit {

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
                this.createNewTransactionForm();
              }

  createNewTransactionForm(){
    this.form = this.formBuilder.group({
      bank_account_number: ['',''],
      bank_account_client_nid: ['',''],
      info: ['',''],
      amount: ['','']
    })
  }

  formEnable(){
    this.form.get('bank_account_number').enable();
    this.form.get('bank_account_client_nid').enable();
    this.form.get('info').enable();
    this.form.get('amount').enable();
  }
  formDisable(){
    this.form.get('bank_account_number').disable();
    this.form.get('bank_account_client_nid').disable();
    this.form.get('info').disable();
    this.form.get('amount').disable();
  }

  onCreateTransactionSubmit(){


    this.processing = true;
    this.formDisable();


    var bank_account_number= this.form.controls.bank_account_number.value;
    var bank_account_client_nid= this.form.controls.bank_account_client_nid.value;
    var info= this.form.controls.info.value;
    var amount= this.form.controls.amount.value;
    var type= this.id.type;



    this.formEnable();
    this.processing = false;

    console.log(this.token,bank_account_number,bank_account_client_nid,type,info,amount);
    this.tellerService.createTransaction(this.token,bank_account_number,bank_account_client_nid,type,info,amount).subscribe((data)=> {

      console.log(data);
      this.formEnable();
      this.processing = false;

      this.router.navigate(['/teller-home'])

    },(errs)=>{

      console.log("Error");
      console.log(errs);


      var errBody = JSON.parse(errs._body)
      this.error = JSON.parse(errs._body).message;


      console.log(errBody);
      if(errBody.auth_problem){
          this.authService.logout();
          this.router.navigate(['/login']);
      }

    })

  }


  ngOnInit() {
    this.id  = this.activatedRoute.snapshot.params;

    if(this.id.type !== 'deposit' && this.id.type !== 'withdraw')
      this.router.navigate(['teller-home'])

    this.type = (this.id.type == 'deposit')? 'Deposit' : 'Withdraw';
  }

}
