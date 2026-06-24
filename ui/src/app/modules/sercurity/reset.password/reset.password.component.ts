declare var require: any
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { validation } from '../../../core/decorators/validator';
import { ResultApi } from '../../../core/domains/data/result.api';
import { ToastrHelper } from '../../../core/helpers/toastr.helper';
import { ResultType } from '../../../core/domains/enums/result.type';
import { AdminUserLoginDto } from '../../../core/domains/objects/user.dto';
import { AdminApiService } from '../../../core/services/admin.api.service';
import { AdminAuthService } from '../../../core/services/admin.auth.service';
import { AdminDataService } from '../../../core/services/admin.data.service';
import { AdminEventService } from '../../../core/services/admin.event.service';
import { UserActivityHelper } from '../../../core/helpers/user.activity.helper';
import { AdminDialogService } from '../../../core/services/admin.dialog.service';
import { AppConfig } from '../../../core/helpers/app.config';

@Component({
    styleUrls: ['./reset.password.component.scss'],
    templateUrl: './reset.password.component.html',
})
export class ResetPasswordComponent implements OnInit {
    code: string;
    processing: boolean;
    loading: boolean = true;
    item = new AdminUserLoginDto();
    logo = AppConfig.Logo;

    constructor(
        public router: Router,
        public data: AdminDataService,
        public event: AdminEventService,
        public authen: AdminAuthService,
        public service: AdminApiService,
        public dialog: AdminDialogService,
        public activeedRoute: ActivatedRoute) {

        if (this.authen.account && !this.authen.account.Locked)
            this.router.navigateByUrl('/');

        this.activeedRoute.queryParams.subscribe(params => {
            this.code = params['code'];
        });
    }

    ngOnInit() {
        if (!this.code) {
            this.dialog.Alert('Notification', 'The verification code is incorrect or invalid.', true);
            this.loading = false;
            return;
        }

        this.service.checkVerify(this.code).then((result: ResultApi) => {
            this.loading = false;
            if (ResultApi.IsSuccess(result) && result.Object) {
                this.item.UserName = result.Object as string;
            } else {
                this.dialog.Alert(
                    'Notification',
                    'The link is incorrect or has expired! Please get a new link <a href="/admin/signin?forgot=1">here</a>',
                    true
                );
            }
        });
    }

    submitSignIn(e: any) {
        if (e && e.keyCode === 13) {
            this.verify();
        }
    }

    async verify() {
        let valid = await validation(this.item, ['Password', 'ConfirmPassword']);
        if (valid) {
            this.processing = true;
            let password = UserActivityHelper.CreateHash256(this.item.Password);
            this.service.verify(this.code, password).then(async (result: ResultApi) => {
                if (result && result.Type == ResultType.Success) {
                    this.dialog.AlertTimeOut(
                        'Notification',
                        'Password updated successfully, please log in to use the system.',
                        5,
                        true
                    );
                    setTimeout(async () => {
                        this.router.navigateByUrl('/');
                    }, 5000);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
                this.processing = false;
            }, (ex: any) => {
                this.processing = false;
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
}
