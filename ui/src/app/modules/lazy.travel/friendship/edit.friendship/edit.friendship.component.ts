import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, OnInit } from '@angular/core';
import { ResultApi } from '../../../../core/domains/data/result.api';
import { ToastrHelper } from '../../../../core/helpers/toastr.helper';
import { EntityHelper } from '../../../../core/helpers/entity.helper';
import { ActionData } from '../../../../core/domains/data/action.data';
import { AdminApiService } from '../../../../core/services/admin.api.service';
import { EditComponent } from '../../../../core/components/edit/edit.component';
import { AdminTranslateService } from '../../../../core/services/admin.translate.service';
import { FriendshipEntity } from '../../../../_app.core/domains/entities/friendship.entity';

@Component({
    templateUrl: './edit.friendship.component.html',
    styleUrls: ['./edit.friendship.component.scss', '../../../../../assets/css/modal.scss'],
})
export class EditFriendshipComponent extends EditComponent implements OnInit {
    id: number;
    loading = true;
    item = new FriendshipEntity();

    constructor() {
        super();
        this.service = AppInjector.get(AdminApiService);
        this.translate = AppInjector.get(AdminTranslateService);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.getParamPopup('id');
        await this.loadItem();
        this.loading = false;
    }

    private async loadItem() {
        this.item = new FriendshipEntity();
        if (this.id) {
            await this.service.item('friendship', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result))
                    this.item = EntityHelper.createEntity(FriendshipEntity, result.Object as FriendshipEntity);
                else ToastrHelper.ErrorResult(result);
            });
        }
    }

    public async confirm(): Promise<boolean> {
        return await this.autoConfirm(this.item);
    }
}
