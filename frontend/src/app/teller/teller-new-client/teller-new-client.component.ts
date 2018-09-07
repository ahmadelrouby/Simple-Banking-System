import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {TellerService} from '../../services/teller.service';
import 'rxjs/add/operator/catch';


@Component({
  selector: 'app-teller-new-client',
  templateUrl: './teller-new-client.component.html',
  styleUrls: ['./teller-new-client.component.css']
})
export class TellerNewClientComponent implements OnInit {

  token;
  form;
  processing;

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
                this.createNewClientForm();
              }


  createNewClientForm(){
    this.form = this.formBuilder.group({
      name: ['',''],
      nid: ['',''],
      phone: ['',''],
      email: ['','']
    })
  }


  formEnable(){
    this.form.get('name').enable();
    this.form.get('nid').enable();
    this.form.get('phone').enable();
    this.form.get('email').enable();
  }
  formDisable(){
    this.form.get('name').disable();
    this.form.get('nid').disable();
    this.form.get('phone').disable();
    this.form.get('email').disable();
  }


  onCreateClientSubmit(){


      this.processing = true;
      this.formDisable();


    var name= this.form.controls.name.value;
    var nid= this.form.controls.nid.value;
    var phone = this.form.controls.phone.value;
    var email = this.form.controls.email.value;

    console.log(name, nid);

      this.tellerService.createClient(this.token,name, nid,phone,email).subscribe((data)=> {

        console.log(data);
        this.formEnable();
        this.processing = false;

        this.router.navigate(['/teller-home'])

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
  }

}
