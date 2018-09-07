import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {ClientService} from '../../services/client.service';
import 'rxjs/add/operator/catch';



@Component({
  selector: 'app-client-view-accounts',
  templateUrl: './client-view-accounts.component.html',
  styleUrls: ['./client-view-accounts.component.css']
})
export class ClientViewAccountsComponent implements OnInit {

  token;
  accounts;

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

  account_link(acc){
    return "/client-view-transactions/" + acc;
  }

  ngOnInit() {

    this.clientService.viewAccounts(this.token).subscribe((data)=> {
      console.log(data);
      this.accounts = data.accounts;
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
