import { Component, OnInit } from '@angular/core';


import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {AdminService} from '../../services/admin.service';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-view-transactions',
  templateUrl: './view-transactions.component.html',
  styleUrls: ['./view-transactions.component.css']
})
export class ViewTransactionsComponent implements OnInit {

  token;
  transactions;

  constructor(private formBuilder: FormBuilder,
              private location: Location,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private adminService: AdminService) {

              this.authService.loadData();
              if(this.authService.login_token == null || this.authService.user_type != 3){
                this.router.navigate(['/login']);
              }

              this.token = this.authService.login_token;
            }

  ngOnInit() {
    this.adminService.getTransactions(this.token).subscribe(data=>{
        console.log(data);
        this.transactions = data.transactions;
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
