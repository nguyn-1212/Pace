import * as _ from 'lodash';
import { Component, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../core/decorators/validator';
import { ResultApi } from '../../../../core/domains/data/result.api';
import { ToastrHelper } from '../../../../core/helpers/toastr.helper';
import { EntityHelper } from '../../../../core/helpers/entity.helper';
import { ActionData } from '../../../../core/domains/data/action.data';
import { EditorComponent } from '../../../../core/editor/editor.component';
import { EditComponent } from '../../../../core/components/edit/edit.component';
import { ConfigurationEntity } from '../../../../_app.core/domains/entities/configuration.entity';

@Component({
    templateUrl: './edit.configuration.component.html',
    styleUrls: ['./edit.configuration.component.scss'],
})
export class ConfigurationComponent extends EditComponent implements OnInit {
    loading: boolean = true;
    item: ConfigurationEntity;
    @ViewChild('uploadLogo') uploadLogo: EditorComponent;

    constructor() {
        super();
    }

    async ngOnInit() {
        this.renderActions();
        await this.loadItem();
        this.loading = false;
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                this.processing = true;

                // Tải ảnh logo lên
                let images = await this.uploadLogo.upload();

                // Lưu cấu hình
                let obj: ConfigurationEntity = _.cloneDeep(this.item);
                obj.Logo = images && images.length > 0 ? images[0].Path : '';
                return await this.service.save('configuration', obj).then(async (result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Configuration saved successfully');
                        await this.loadItem();
                        return true;
                    } else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                }, () => {
                    return false;
                });
            }
        }
        return false;
    }

    private async loadItem() {
        this.loading = true;
        await this.service.callApiUrl('configuration/defaultItem').then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.item = EntityHelper.createEntity(ConfigurationEntity, result.Object);
            } else this.item = new ConfigurationEntity();
        });
        this.loading = false;
    }
    
    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.saveUpdate('Save Changes', () => { this.confirm() }),
        ]
        this.actions = await this.authen.actionsAllow(ConfigurationEntity, actions);
    }
}
