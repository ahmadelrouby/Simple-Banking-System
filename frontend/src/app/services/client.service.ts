import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  backend_domain = 'http://localhost:3000/client/';

  constructor(private http: Http) {}

  viewAccounts(token){
    return this.http.post(this.backend_domain + 'view-accounts',{token: token}).map(res => res.json());
  }

  viewTransactions(token, bank_account_number){
    return this.http.post(this.backend_domain + 'view-transactions',{token: token,bank_account_number:bank_account_number}).map(res => res.json());
  }


  updateInfo(token, phone, email){
    if(!phone)
      phone = null;

    if(!email)
      email = null;

    return this.http.post(this.backend_domain + 'update-info',{token: token,phone:phone,email:email}).map(res => res.json());

  }


  getClientData(token){
    return this.http.post(this.backend_domain + 'get-info',{token: token}).map(res => res.json());
  }

  
  changePwd(token, account_password){
    return this.http.post(this.backend_domain + 'change-pwd',{token: token,account_password:account_password}).map(res => res.json());
  }

  transferMoney(token, from_bank_account, to_bank_account, amount){

    var obj = {
      token: token,
      from_bank_account: from_bank_account,
      to_bank_account: to_bank_account,
      amount: amount
    };

    return this.http.post(this.backend_domain + 'transfer-money',obj).map(res => res.json());
  }





}
