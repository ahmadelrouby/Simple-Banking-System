import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {AdminService} from '../../services/admin.service';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-admin-change-password',
  templateUrl: './admin-change-password.component.html',
  styleUrls: ['./admin-change-password.component.css']
})
export class AdminChangePasswordComponent implements OnInit {

  id;
  type;

  token;
  form;
  processing;

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
                this.createLoginForm();

              }

  createLoginForm(){
        this.form = this.formBuilder.group({
          username: ['',''],
          account_password: ['','']
        })
    }


  formEnable(){
    this.form.get('username').enable();
    this.form.get('account_password').enable();
  }
  formDisable(){
    this.form.get('username').disable();
    this.form.get('account_password').disable();
  }


  onChangePwdSubmit(){

      this.processing = true;
      this.formDisable();


    var username= this.form.controls.username.value;
    var password= this.form.controls.account_password.value;



      this.adminService.change_pwd(this.token,username, password).subscribe((data)=> {
        console.log(data);
        this.formEnable();
        this.processing = false;

        this.router.navigate(['/admin-home'])

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
    this.id  = this.activatedRoute.snapshot.params;
    console.log("type: " + this.id.type)
    if(this.id.type !== 'admin' && this.id.type !== 'teller')
      this.router.navigate(['admin-home'])

    this.type = (this.id.type == 'admin')? 'Admin' : 'Teller';
  }

}
