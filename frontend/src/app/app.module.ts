import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import {AppRoutingModule} from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ClientHomeComponent } from './client/client-home/client-home.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { TellerHomeComponent } from './teller/teller-home/teller-home.component';


import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AdminNewAccountComponent } from './admin/admin-new-account/admin-new-account.component';
import { AdminDeleteAccountComponent } from './admin/admin-delete-account/admin-delete-account.component';
import { AdminChangePasswordComponent } from './admin/admin-change-password/admin-change-password.component';
import { AdminApplicationsAllComponent } from './admin/admin-applications-all/admin-applications-all.component';
import { AdminApplicationsSpecificComponent } from './admin/admin-applications-specific/admin-applications-specific.component';
import { ViewTransactionsComponent } from './admin/view-transactions/view-transactions.component';

import { TellerNewClientComponent } from './teller/teller-new-client/teller-new-client.component';
import { TellerNewTransactionComponent } from './teller/teller-new-transaction/teller-new-transaction.component';
import { TellerNewAccountComponent } from './teller/teller-new-account/teller-new-account.component';
import { TellerViewAccountsComponent } from './teller/teller-view-accounts/teller-view-accounts.component';
import { TellerViewTransactionsComponent } from './teller/teller-view-transactions/teller-view-transactions.component';

import { ClientViewAccountsComponent } from './client/client-view-accounts/client-view-accounts.component';
import { ClientViewTransactionsComponent } from './client/client-view-transactions/client-view-transactions.component';
import { ClientTransferMoneyComponent } from './client/client-transfer-money/client-transfer-money.component';
import { ClientUpdateInfoComponent } from './client/client-update-info/client-update-info.component';
import { ClientChangePwdComponent } from './client/client-change-pwd/client-change-pwd.component';
import { NewPasswordComponent } from './new-password/new-password.component';

import {AuthService} from './services/auth.service';
import {ClientService} from './services/client.service';
import {AdminService} from './services/admin.service';
import {TellerService} from './services/teller.service';

import { FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TellerChangePwdComponent } from './teller/teller-change-pwd/teller-change-pwd.component';
import { LogoutComponent } from './logout/logout.component';
import { BankHomeComponent } from './bank-home/bank-home.component';
import { FogetPwdComponent } from './foget-pwd/foget-pwd.component';


@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    LoginComponent,
    RegisterComponent,
    ClientHomeComponent,
    AdminHomeComponent,
    TellerHomeComponent,
    AdminNewAccountComponent,
    AdminDeleteAccountComponent,
    AdminChangePasswordComponent,
    AdminApplicationsAllComponent,
    AdminApplicationsSpecificComponent,
    ViewTransactionsComponent,
    TellerNewClientComponent,
    TellerNewTransactionComponent,
    TellerNewAccountComponent,
    TellerViewAccountsComponent,
    TellerViewTransactionsComponent,
    ClientViewAccountsComponent,
    ClientViewTransactionsComponent,
    ClientTransferMoneyComponent,
    ClientUpdateInfoComponent,
    ClientChangePwdComponent,
    NewPasswordComponent,
    TellerChangePwdComponent,
    LogoutComponent,
    BankHomeComponent,
    FogetPwdComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgbModule.forRoot()
  ],
  providers: [AuthService,ClientService,AdminService,TellerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
