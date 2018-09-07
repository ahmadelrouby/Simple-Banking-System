import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class TellerService {

  backend_domain = 'http://localhost:3000/teller/';

  constructor(private http: Http) {}

  changePwd(token, new_password){
    return this.http.post(this.backend_domain + 'change-pwd',{token: token,new_password:new_password}).map(res => res.json());
  }

  viewAccounts(token, client_id){
    return this.http.post(this.backend_domain + 'view-accounts',{token: token,client_id:client_id}).map(res => res.json());
  }

  viewClient(token, client_id){
    return this.http.post(this.backend_domain + 'view-client',{token: token,client_id:client_id}).map(res => res.json());
  }

  viewTransactions(token, bank_account_number){
    return this.http.post(this.backend_domain + 'view-transaction',{token: token,bank_account_number:bank_account_number}).map(res => res.json());
  }


  getCurrencies(token){
    return this.http.post(this.backend_domain + 'get-currencies',{token: token}).map(res => res.json());
  }


  createAccount(token, client_nid, account_type, currency_name){
    return this.http.post(this.backend_domain + 'create-account',
    {token: token, client_nid:client_nid, account_type:account_type, currency_name:currency_name})
    .map(res => res.json());
  }


  createClient(token, client_name, national_id,phone, email){
    return this.http.post(this.backend_domain + 'create-client',
    {token: token, client_name:client_name, national_id:national_id, phone: phone, email: email})
    .map(res => res.json());
  }

  createTransaction(token, bank_account_number, bank_account_client_nid, type, info, amount){
    var obj = {token: token,bank_account_number:bank_account_number,
                bank_account_client_nid:bank_account_client_nid,
                type:type,
                info:info,
                amount:amount};

    console.log(obj)
    return this.http.post(this.backend_domain + 'create-transaction',obj).map(res => res.json());
  }

}
