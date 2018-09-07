import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {TellerService} from '../../services/teller.service';
import 'rxjs/add/operator/catch';


@Component({
  selector: 'app-teller-home',
  templateUrl: './teller-home.component.html',
  styleUrls: ['./teller-home.component.css']
})
export class TellerHomeComponent implements OnInit {

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

                this.createForms();


            }

  clientForm;
  accountForm;


  createForms(){
    this.clientForm = this.formBuilder.group({
      client_nid: ['','']
    })

    this.accountForm = this.formBuilder.group({
      bank_account: ['','']
    })
  }

  onSubmitClient(){
    var client_nid = this.clientForm.controls.client_nid.value;
    var final_url = '/teller-view-accounts/' + client_nid;
    this.router.navigate([final_url]);
  }

  onSubmitAccount(){

    var bank_account = this.accountForm.controls.bank_account.value;
    var final_url = '/teller-view-transactions/' + bank_account;
    this.router.navigate([final_url]);
  }


  ngOnInit() {
  }

}
