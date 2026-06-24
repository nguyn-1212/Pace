import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../core/decorators/validator';
import { ResultApi } from '../../../../core/domains/data/result.api';
import { ToastrHelper } from '../../../../core/helpers/toastr.helper';
import { ValidatorHelper } from '../../../../core/helpers/validator.helper';
import { AdminApiService } from '../../../../core/services/admin.api.service';
import { AdminUserForgotPasswordDto } from '../../../../core/domains/objects/user.dto';

@Component({
    templateUrl: './forgot.password.component.html',
    styleUrls: [
        './forgot.password.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class ForgotPasswordComponent implements OnInit {    
    disabled: boolean = true;
    service: AdminApiService;
    item: AdminUserForgotPasswordDto = new AdminUserForgotPasswordDto();

    constructor() {
        this.service = AppInjector.get(AdminApiService);
    }

    ngOnInit() {
    }

    valueChange() {
        this.disabled = this.item.Email && ValidatorHelper.validEmail(this.item.Email) ? false : true;
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                return await this.service.resetPassword(this.item.Email).then((result: ResultApi) => {
                    if (ResultApi.IsSuccess(result)) return true;
                    else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                }, (e: any) => {
                    ToastrHelper.Exception(e);
                    return false;
                });
            }
        }
        return false;
    }
}