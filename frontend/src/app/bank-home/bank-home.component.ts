import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../services/auth.service';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-bank-home',
  templateUrl: './bank-home.component.html',
  styleUrls: ['./bank-home.component.css']
})
export class BankHomeComponent implements OnInit {

  isAdmin;
  isClient;
  isTeller;

  constructor(private formBuilder: FormBuilder,
              private location: Location,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private authService: AuthService) {


            this.authService.loadData();
            if(this.authService.login_token == null){
              this.router.navigate(['/login']);
            }


            if(this.authService.user_type == 3){
              this.isAdmin = true;
            }else if(this.authService.user_type == 2){
                this.isTeller = true;
                console.log(this.authService.client_nid)
                if (this.authService.client_nid != "null")
                {
                  this.isClient = true;
                }
            }else if(this.authService.user_type == 1){
                this.isClient = true;
            }

  }

  ngOnInit() {
  }

}
