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
import { PlaceWeatherEntity } from '../../../../_app.core/domains/entities/place.weather.entity';

@Component({
    templateUrl: './edit.place.weather.component.html',
    styleUrls: ['./edit.place.weather.component.scss', '../../../../../assets/css/modal.scss'],
})
export class EditPlaceWeatherComponent extends EditComponent implements OnInit {
    id: number; loading = true; item = new PlaceWeatherEntity();
    constructor() {
        super();
        this.service = AppInjector.get(AdminApiService);
        this.translate = AppInjector.get(AdminTranslateService);
        this.state = this.getUrlState();
    }
    async ngOnInit() {
        this.id = this.getParam('id');
        this.viewer = this.getParam('viewer');
        if (this.state) this.addBreadcrumb(this.id ? (this.viewer ? 'Xem' : 'Chỉnh sửa') : 'Thêm mới');
        this.renderActions();
        await this.loadItem();
        this.loading = false;
    }
    private async loadItem() {
        this.item = new PlaceWeatherEntity();
        if (this.id) await this.service.item('placeweather', this.id).then((r: ResultApi) => {
            if (ResultApi.IsSuccess(r)) this.item = EntityHelper.createEntity(PlaceWeatherEntity, r.Object as PlaceWeatherEntity);
            else ToastrHelper.ErrorResult(r);
        });
    }
    private renderActions() {
        this.actions = this.id
            ? [ActionData.back(() => this.back()), this.viewer
                ? ActionData.gotoEdit('Chỉnh sửa', () => this.edit(this.item))
                : ActionData.saveUpdate('Lưu', () => this.confirmAndBack())]
            : [ActionData.back(() => this.back()), ActionData.saveAddNew('Thêm', () => this.confirmAndBack())];
    }
    private async confirmAndBack() { if (await this.autoConfirm(this.item)) this.back(); }
    private edit(item: PlaceWeatherEntity) {
        this.router.navigate(['/admin/placeweather/edit'], { state: { params: JSON.stringify({ id: item.Id, prevUrl: '/admin/placeweather' }) } });
    }
}
