declare var toastr: any;
import * as _ from 'lodash';
import { AppInjector } from '../../../app.module';
import { Component, OnInit } from '@angular/core';
import { validation } from '../../../core/decorators/validator';
import { ResultApi } from '../../../core/domains/data/result.api';
import { ToastrHelper } from '../../../core/helpers/toastr.helper';
import { EntityHelper } from '../../../core/helpers/entity.helper';
import { MethodType } from '../../../core/domains/enums/method.type';
import { AdminApiService } from '../../../core/services/admin.api.service';
import { AdminDataService } from '../../../core/services/admin.data.service';
import { UserActivityHelper } from '../../../core/helpers/user.activity.helper';
import { AdminUserResetPasswordDto } from '../../../core/domains/objects/user.dto';

@Component({
    templateUrl: 'change.password.component.html',
})
export class ChangePasswordComponent implements OnInit {
    data: AdminDataService;
    service: AdminApiService
    item: AdminUserResetPasswordDto;

    constructor() {
        this.data = AppInjector.get(AdminDataService)
        this.service = AppInjector.get(AdminApiService);
    }
    ngOnInit() {
        this.item = EntityHelper.createEntity(AdminUserResetPasswordDto)
    }
    public async confirm(): Promise<boolean> {
        let valid = await validation(this.item);
        if (!valid) return false;

        let entity: any = {
            Password: UserActivityHelper.CreateHash256(this.item.Password),
            Activity: await UserActivityHelper.UserActivity(this.data.countryIp),
            OldPassword: UserActivityHelper.CreateHash256(this.item.OldPassword),
            ConfirmPassword: UserActivityHelper.CreateHash256(this.item.ConfirmPassword),
        };
        var result = await this.service.callApiUrl('/security/adminChangePassword', entity, MethodType.Post);
        if (ResultApi.IsSuccess(result)) {
            return true;
        } else {
            ToastrHelper.ErrorResult(result);
            return false;
        }
    }
}
