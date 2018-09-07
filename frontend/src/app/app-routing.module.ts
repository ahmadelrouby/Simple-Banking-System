import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {AppComponent} from './app.component';
import {AboutComponent} from './about/about.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ClientHomeComponent } from './client/client-home/client-home.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { TellerHomeComponent } from './teller/teller-home/teller-home.component';

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
import { TellerChangePwdComponent } from './teller/teller-change-pwd/teller-change-pwd.component';
import { LogoutComponent } from './logout/logout.component';
import { BankHomeComponent } from './bank-home/bank-home.component';
import { FogetPwdComponent } from './foget-pwd/foget-pwd.component';


const appRoutes: Routes = [
{
  path: '',
  component: LoginComponent
},{
  path: 'home',
  component: BankHomeComponent
},{
  path: 'about',
  component: LoginComponent
},{
  path: 'login',
  component: LoginComponent
},{
  path: 'register',
  component: RegisterComponent
},{
  path: 'admin-home',
  component: AdminHomeComponent
},{
  path: 'admin-new-account/:type',
  component: AdminNewAccountComponent
},{
  path: 'admin-delete-account/:type',
  component: AdminDeleteAccountComponent
},{
  path: 'admin-change-password/:type',
  component: AdminChangePasswordComponent
},{
  path: 'admin-applications-all',
  component: AdminApplicationsAllComponent
},{
  path: 'admin-applications-specific/:id',
  component: AdminApplicationsSpecificComponent
},{
  path: 'admin-view-transactions',
  component: ViewTransactionsComponent
},{
  path: 'teller-home',
  component: TellerHomeComponent
},{
  path: 'teller-new-client',
  component: TellerNewClientComponent
},{
  path: 'teller-new-transaction/:type',
  component: TellerNewTransactionComponent
},{
  path: 'teller-new-account/:type',
  component: TellerNewAccountComponent
},{
  path: 'teller-view-accounts/:client_id',
  component: TellerViewAccountsComponent
},{
  path: 'teller-view-transactions/:bank_account',
  component: TellerViewTransactionsComponent
},{
  path: 'client-home',
  component: ClientHomeComponent
},{
  path: 'client-change-pwd',
  component: ClientChangePwdComponent
},{
  path: 'client-transfer-money',
  component: ClientTransferMoneyComponent
},{
  path: 'client-update-info',
  component: ClientUpdateInfoComponent
},{
  path: 'client-view-accounts',
  component: ClientViewAccountsComponent
},{
  path: 'client-view-transactions/:account',
  component: ClientViewTransactionsComponent
},{
  path: 'new-password',
  component: NewPasswordComponent
},{
  path: 'teller-change-pwd',
  component: TellerChangePwdComponent
},{
  path: 'logout',
  component: LogoutComponent
},{
  path: 'forget-pwd',
  component: FogetPwdComponent
}
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [],
  exports: [RouterModule]

})
export class AppRoutingModule {}
