import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {ClientService} from '../../services/client.service';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-client-view-transactions',
  templateUrl: './client-view-transactions.component.html',
  styleUrls: ['./client-view-transactions.component.css']
})
export class ClientViewTransactionsComponent implements OnInit {

  account;
  token;
  transactions;

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
  }

  ngOnInit() {

    this.account  = this.activatedRoute.snapshot.params.account;

    this.clientService.viewTransactions(this.token,this.account).subscribe((data)=> {

      console.log(data);
      this.transactions = data.transactions;

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
