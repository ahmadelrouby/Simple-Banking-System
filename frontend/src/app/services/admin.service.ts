import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  backend_domain = 'http://localhost:3000/admin/';

  constructor(private http: Http) {}


  getAccounts(token, nid){
    return this.http.post(this.backend_domain + 'compare-application' , {token: token,client_id:nid}).map(res => res.json());
  }

  check_teller(token, username){
    return this.http.post(this.backend_domain + 'is-teller' , {token: token,username:username}).map(res => res.json());
  }



  getApplications(token){
    return this.http.post(this.backend_domain + 'view-all-applications' , {token: token}).map(res => res.json());
  }

  getTransactions(token){
    return this.http.post(this.backend_domain + 'view-transactions' , {token: token}).map(res => res.json());
  }

  approveApplication(token,app_id){
    return this.http.post(this.backend_domain + 'approve-application' , {token: token,app_id:app_id}).map(res => res.json());
  }

  getSingleApplication(token,app_id){
    return this.http.post(this.backend_domain + 'view-single-application' , {token: token,app_id:app_id}).map(res => res.json());
  }
  change_pwd(token,username,account_password){
    return this.http.post(this.backend_domain + 'change-user-pwd',
    {token: token,username:username,account_password:account_password}).map(res => res.json());
  }

  create_user(token,username,account_password,user_role){
    var obj = {token: token,username:username,account_password:account_password,user_role:user_role};
    console.log(obj)
    return this.http.post(this.backend_domain + 'create-user',obj).map(res => res.json());
  }

  delete_user(token,username){
    return this.http.post(this.backend_domain + 'remove-user',{token: token,username:username}).map(res => res.json());
  }

}
