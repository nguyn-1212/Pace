import { AppComponent } from './app.component';
import { Injector, NgModule } from '@angular/core';
import { LayoutModule } from './_layout/layout.module';
import { AppRoutingModule } from './app-routing.module';
import { UtilityModule } from './modules/utility.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { UserIdleModule, UserIdleService } from 'angular-user-idle';
import { ErrorInterceptor } from './core/interceptor/error.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// services
import { setEnvironment } from './app.config';
import { DataService } from './services/data.service';
import { VersionService } from './services/version.service';
import { UserService } from './modules/sercurity/user/user.service';
import { RoleService } from './modules/sercurity/role/role.service';
import { AdminApiService } from './core/services/admin.api.service';
import { AdminChatService } from './core/services/admin.chat.service';
import { AdminAuthService } from './core/services/admin.auth.service';
import { AdminDataService } from './core/services/admin.data.service';
import { AdminEventService } from './core/services/admin.event.service';
import { AdminDialogService } from './core/services/admin.dialog.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminTranslateService } from './core/services/admin.translate.service';

setEnvironment();
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    LayoutModule,
    UtilityModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    UserIdleModule.forRoot({ idle: 6000, timeout: 60, ping: 1000 }),
    NgxSkeletonLoaderModule.forRoot({ animation: 'pulse', loadingText: 'This item is actually loading...' }),
  ],
  providers: [
    DataService,
    UserService,
    RoleService,
    VersionService,
    UserIdleService,
    AdminApiService,
    AdminChatService,
    AdminAuthService,
    AdminDataService,
    AdminEventService,
    AdminDialogService,
    AdminTranslateService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(private injector: Injector) {
    AppInjector = this.injector;
  }
}
export let AppInjector: Injector;
