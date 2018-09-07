import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {ClientService} from '../../services/client.service';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.css']
})
export class ClientHomeComponent implements OnInit {

  name;
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
          this.name = this.authService.clientName;
  }

  ngOnInit() {
  }

}
