import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {AdminService} from '../../services/admin.service';
import 'rxjs/add/operator/catch';


@Component({
  selector: 'app-admin-applications-specific',
  templateUrl: './admin-applications-specific.component.html',
  styleUrls: ['./admin-applications-specific.component.css']
})
export class AdminApplicationsSpecificComponent implements OnInit {

  token;
  application;

  isTeller;
  accounts;

  error;
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
                this.isTeller = "Loading..."

              }

  onApprove(){
    console.log("approving...")
    this.adminService.approveApplication(this.token,this.application.app_id).subscribe(data=>{
      this.router.navigate(['/admin-applications-all']);
    },(errs)=>{
        console.log("Error");
        console.log(errs);

        this.error = JSON.parse(errs._body).message;

        var errBody = JSON.parse(errs._body)
        if(errBody.auth_problem){
            this.authService.logout();
            this.router.navigate(['/login']);
        }
    })
  }
  ngOnInit() {
    var app_id = this.activatedRoute.snapshot.params.id;
    this.adminService.getSingleApplication(this.token,app_id).subscribe(data=>{
        console.log(data);
        this.application = data.application;

        var username = this.application.applicant_username;
        var client_id = this.application.applicant_national_id;

        this.adminService.getAccounts(this.token, client_id).subscribe(data=>{

          this.accounts = data.accounts;



        },(errs)=>{
            console.log("Error");
            console.log(errs);
            var errBody = JSON.parse(errs._body)
            if(errBody.auth_problem){
                this.authService.logout();
                this.router.navigate(['/login']);
            }
        })


        this.adminService.check_teller(this.token, username).subscribe(data=>{

          this.isTeller = (data.tellerInfo.isTeller == true)? 'Yes' : 'No';

        },(errs)=>{
            console.log("Error");
            console.log(errs);
            var errBody = JSON.parse(errs._body)
            if(errBody.auth_problem){
                this.authService.logout();
                this.router.navigate(['/login']);
            }
        })

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
