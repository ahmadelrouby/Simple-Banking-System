import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {AdminService} from '../../services/admin.service';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {


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
          }

  ngOnInit() {
  }

}
