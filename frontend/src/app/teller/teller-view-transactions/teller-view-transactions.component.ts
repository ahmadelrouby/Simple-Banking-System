import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {TellerService} from '../../services/teller.service';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-teller-view-transactions',
  templateUrl: './teller-view-transactions.component.html',
  styleUrls: ['./teller-view-transactions.component.css']
})
export class TellerViewTransactionsComponent implements OnInit {


  account;
  token;
  transactions;

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
  }


  client_link(id){
    return "/teller-view-accounts/" + id;
  }
  ngOnInit() {
    this.account = this.activatedRoute.snapshot.params.bank_account;
    if (!this.account)
      this.router.navigate(['teller-home'])

    this.tellerService.viewTransactions(this.token, this.account).subscribe((data)=> {
      console.log(data);
      this.transactions = data.data;
    },(errs)=>{
      console.log("Error");
      var errBody = JSON.parse(errs._body)
      console.log(errBody);
      if(errBody.auth_problem){
          this.authService.logout();
          this.router.navigate(['/login']);
      }})
  }

}
