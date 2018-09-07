import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {TellerService} from '../../services/teller.service';
import 'rxjs/add/operator/catch';



@Component({
  selector: 'app-teller-view-accounts',
  templateUrl: './teller-view-accounts.component.html',
  styleUrls: ['./teller-view-accounts.component.css']
})
export class TellerViewAccountsComponent implements OnInit {

  nid;
  token;
  accounts;
  client;

  exists;
  loading;

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

  }

  account_link(acc){
    return "/teller-view-transactions/" + acc;
  }
  ngOnInit() {

    this.exists = true;
    this.loading = true;

    this.nid = this.activatedRoute.snapshot.params.client_id;
    if (!this.nid)
      this.router.navigate(['teller-home'])

    this.tellerService.viewClient(this.token, this.nid).subscribe((data)=> {
      console.log(data);
      this.exists = true;
      this.loading = false;

      this.client = data.data;
      this.tellerService.viewAccounts(this.token, this.nid).subscribe((data)=> {
        console.log(data);
        this.accounts = data.data;
      },(errs)=>{
        console.log("Error");
        var errBody = JSON.parse(errs._body)
        console.log(errBody);
        if(errBody.auth_problem){
            this.authService.logout();
            this.router.navigate(['/login']);
        }})

    },(errs)=>{


      this.loading = false;

      console.log("Error");
      var errBody = JSON.parse(errs._body)
      console.log(errBody);

      if(errBody.auth_problem){
          this.authService.logout();
          this.router.navigate(['/login']);
      }

      if(errBody.exists_error){
        this.exists = false;
      }

    })






  }

}
