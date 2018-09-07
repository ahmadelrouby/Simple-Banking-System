import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  backend_domain = 'http://localhost:3000/';
  login_token;
  user_type;
  client_nid;
  isNewPassword;
  clientName;

  constructor(private http: Http) {}

  forgetpwd(nid){
    return this.http.post(this.backend_domain + 'client/forget-pwd',{national_id:nid}).map(res=>res.json())
  }

  loginUser(user){
    return this.http.post(this.backend_domain + 'auth/login',user).map(res=>res.json())
  }

  registerUser(user){
    return this.http.post(this.backend_domain + 'auth/register',user).map(res=>res.json())
  }

  saveData(){
    localStorage.setItem('token', this.login_token);
    localStorage.setItem('isNewPassword', this.isNewPassword);
    localStorage.setItem('role', this.user_type );
    localStorage.setItem('client_nid', this.client_nid);
    localStorage.setItem('clientName', this.clientName);

  }
  saveUserData(data){
    this.login_token = data.token
    this.isNewPassword = data.data.isNewPassword
    this.user_type = data.data.user_role
    this.client_nid = data.data.client_nid
    this.clientName = data.data.client_name

    localStorage.setItem('token', data.token);
    localStorage.setItem('isNewPassword', data.data.isNewPassword);
    localStorage.setItem('role', data.data.user_role);
    localStorage.setItem('client_nid', data.data.client_nid);
    localStorage.setItem('clientName', data.data.client_name);
  }


  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('isNewPassword');
    localStorage.removeItem('role');
    localStorage.removeItem('client_nid');
    localStorage.removeItem('clientName');


    this.login_token = null;
    this.isNewPassword = null;
    this.user_type = null;
    this.client_nid = null;
    this.clientName = null;

  }

  loadData(){
    this.login_token = localStorage.getItem('token');
    this.isNewPassword = localStorage.getItem('isNewPassword');
    this.user_type = localStorage.getItem('role');
    this.client_nid = localStorage.getItem('client_nid');
    this.clientName = localStorage.getItem('clientName');

  }




}
