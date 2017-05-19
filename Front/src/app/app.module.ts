import {NgModule}             from '@angular/core';
import {BrowserModule}        from '@angular/platform-browser';
import {FormsModule}          from '@angular/forms';

import {AppComponent}         from './app.component';

import {AppRoutingModule}     from './app-routing.module';
import {AuthorizationService} from "./services/authorization/authorization.service";
import {EBayComponent}        from "./components/eBay/eBay.component";
import {OrdersComponent}      from "./components/orders/orders.component";
import {HistoryComponent}     from "./components/history/history.component";
import {LoginComponent}       from "./components/login/login.component";
import {SettingsComponent}    from "./components/settings/settings.component";
import {AuthorizationHttp}    from "./services/authorizationHttp/authorizationHttp";
import {AutocompleteComponent} from "./services/autocomplete/autocomplete.component";
import {EBayService} from "./services/eBayApi/eBayApi.service";
import {HttpModule, JsonpModule} from "@angular/http";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    JsonpModule,
    HttpModule
  ],
  declarations: [
    AutocompleteComponent,
    AppComponent,
    EBayComponent,
    OrdersComponent,
    HistoryComponent,
    SettingsComponent,
    LoginComponent
  ],
  providers: [
    AuthorizationService,
    AuthorizationHttp
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
