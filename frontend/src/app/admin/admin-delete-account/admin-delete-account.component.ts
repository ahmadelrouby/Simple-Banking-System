import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {AdminService} from '../../services/admin.service';
import 'rxjs/add/operator/catch';


@Component({
  selector: 'app-admin-delete-account',
  templateUrl: './admin-delete-account.component.html',
  styleUrls: ['./admin-delete-account.component.css']
})
export class AdminDeleteAccountComponent implements OnInit {


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
          username: ['','']
        })
    }

  formEnable(){
    this.form.get('username').enable();
  }
  formDisable(){
    this.form.get('username').disable();
  }

  onDeleteUserSubmit(){

      this.processing = true;
      this.formDisable();

      var username= this.form.controls.username.value;

      this.adminService.delete_user(this.token,username).subscribe((data)=> {
        console.log(data);
        this.formEnable();
        this.processing = false;

        this.router.navigate(['/admin-home'])

      },(errs)=>{

        this.error = JSON.parse(errs._body).message;

        console.log("Error");
        console.log(errs);
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
