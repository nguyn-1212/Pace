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
import { VoteOptionEntity } from '../../../../_app.core/domains/entities/vote.option.entity';

@Component({
    templateUrl: './edit.vote.option.component.html',
    styleUrls: ['./edit.vote.option.component.scss', '../../../../../assets/css/modal.scss'],
})
export class EditVoteOptionComponent extends EditComponent implements OnInit {
    id: number;
    loading = true;
    item = new VoteOptionEntity();

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
        this.item = new VoteOptionEntity();
        if (this.id) {
            await this.service.item('voteoption', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result))
                    this.item = EntityHelper.createEntity(VoteOptionEntity, result.Object as VoteOptionEntity);
                else ToastrHelper.ErrorResult(result);
            });
        }
    }

    public async confirm(): Promise<boolean> {
        return await this.autoConfirm(this.item);
    }
}
