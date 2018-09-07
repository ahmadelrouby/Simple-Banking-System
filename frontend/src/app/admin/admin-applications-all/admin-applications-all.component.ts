import { Component, OnInit } from '@angular/core';


import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {AdminService} from '../../services/admin.service';
import 'rxjs/add/operator/catch';



@Component({
  selector: 'app-admin-applications-all',
  templateUrl: './admin-applications-all.component.html',
  styleUrls: ['./admin-applications-all.component.css']
})
export class AdminApplicationsAllComponent implements OnInit {

  token;
  applications;

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
            }

  applicationId(id){
    var x = "/admin-applications-specific/" + id ;
    console.log(x);
    return x;
  }
  ngOnInit() {
    this.adminService.getApplications(this.token).subscribe(data=>{
        console.log(data);
        this.applications = data.onlineApplications;
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

}
