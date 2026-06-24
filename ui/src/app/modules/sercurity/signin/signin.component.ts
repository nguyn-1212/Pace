declare var require: any
declare var $: any
import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from '../../../core/helpers/app.config';
import { validation } from '../../../core/decorators/validator';
import { ResultApi } from '../../../core/domains/data/result.api';
import { ToastrHelper } from '../../../core/helpers/toastr.helper';
import { ResultType } from '../../../core/domains/enums/result.type';
import { AdminApiService } from '../../../core/services/admin.api.service';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthService } from '../../../core/services/admin.auth.service';
import { AdminDataService } from '../../../core/services/admin.data.service';
import { AdminEventService } from '../../../core/services/admin.event.service';
import { UserActivityHelper } from '../../../core/helpers/user.activity.helper';
import { AdminDialogService } from '../../../core/services/admin.dialog.service';
import { ForgotPasswordComponent } from './forgot.password/forgot.password.component';
import { AdminUserDto, AdminUserLoginDto } from '../../../core/domains/objects/user.dto';

@Component({
    styleUrls: ['./signin.component.scss'],
    templateUrl: './signin.component.html',
})
export class SignInComponent implements OnInit {
    processing: boolean;
    item = new AdminUserLoginDto();
    userLogin = new AdminUserDto();
    formOtp = false;
    logo = AppConfig.Logo;

    constructor(
        public router: Router,
        public data: AdminDataService,
        public event: AdminEventService,
        public authen: AdminAuthService,
        public service: AdminApiService,
        public dialog: AdminDialogService,
        public activeedRoute: ActivatedRoute) {
        this.activeedRoute.queryParams.subscribe(params => {
            let forgot = params['forgot'];
            if (forgot) {
                setTimeout(() => {
                    this.forgotPassword();
                }, 500);
            }

        });
    }

    ngOnInit() {
        if (this.authen.account && !this.authen.account.Locked)
            this.router.navigateByUrl('/');
    }

    submitSignIn(e: any) {
        if (e && e.keyCode === 13) {
            this.signin();
        }
    }

    async signin() {
        let valid = await validation(this.item, ['UserName', 'Password']);
        if (valid) {
            this.processing = true;
            let obj: AdminUserLoginDto = _.cloneDeep(this.item);
            obj.Password = UserActivityHelper.CreateHash256(obj.Password);
            // obj.Activity = await UserActivityHelper.UserActivity(this.data.countryIp);
            this.service.signin(obj).then(async (result: ResultApi) => {
                if (result && result.Type == ResultType.Success && result.Object) {
                    this.userLogin = result.Object;
                    if (this.userLogin.NeedOTP) {
                        this.formOtp = true;
                        $("#kt_otp_form").fadeIn(200);
                        $("#kt_login_form").fadeOut(200);
                    } else {
                        this.formOtp = false;
                        await this.authen.login(result.Object, this.item.RememberMe, false);
                    }
                } else ToastrHelper.ErrorResult(result);
                this.processing = false;
            }, (ex: any) => {
                this.processing = false;
                ToastrHelper.Exception(ex);
            });
        }
    }

    async loginOtp() {
        let valid = await validation(this.item, ['Otp']);
        if (valid) {
            this.processing = true;
            this.service.validateAuthenticator(this.userLogin.Id, this.item.Otp).then(async (result: ResultApi) => {
                if (result && result.Type == ResultType.Success) {
                    this.formOtp = false;
                    await this.authen.login(this.userLogin, this.item.RememberMe, false);
                } else ToastrHelper.ErrorResult(result);
                this.processing = false;
            }, (ex: any) => {
                this.processing = false;
                this.item.Otp = null;
                ToastrHelper.Exception(ex);
            });
        }
    }

    signUp() {
        this.dialog.Alert('Notification', 'Please contact <b>Admin</b> to create an account.');
    }

    tutorial() {
        this.dialog.Alert('Notification', 'Please contact <b>Admin</b> for guidance.');
    }

    contact() {
        this.dialog.Alert('Notification', 'Please contact <b>Admin</b>.');
    }

    forgotPassword() {
        this.dialog.WapperAsync({
            cancelText: 'Cancel',
            title: 'Forgot Password',
            confirmText: 'Confirm',
            size: ModalSizeType.Medium,
            object: ForgotPasswordComponent
        }, async () => {
            this.dialog.Alert('Notification', 'The system has sent a password reset email to your mailbox.');
        });
    }

}
