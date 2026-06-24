import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { validation } from '../../../../core/decorators/validator';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { UserDto } from '../../../../core/domains/objects/user.dto';
import { ResultApi } from '../../../../core/domains/data/result.api';
import { ToastrHelper } from '../../../../core/helpers/toastr.helper';
import { EntityHelper } from '../../../../core/helpers/entity.helper';
import { ActionData } from '../../../../core/domains/data/action.data';
import { MethodType } from '../../../../core/domains/enums/method.type';
import { AdminApiService } from '../../../../core/services/admin.api.service';
import { UserService } from '../../../../modules/sercurity/user/user.service';
import { EditComponent } from '../../../../core/components/edit/edit.component';
import { DepartmentDto } from '../../../../core/domains/objects/department.dto';
import { AdminDialogService } from '../../../../core/services/admin.dialog.service';
import { DepartmentEntity } from '../../../../core/domains/entities/department.entity';
import { ViewChoiceUserComponent } from '../../../../modules/sercurity/user/choice.user/view.choice.user.component';

@Component({
    templateUrl: './edit.department.component.html',
    styleUrls: [
        './edit.department.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditDepartmentComponent extends EditComponent implements OnInit {
    id: number;
    popup: boolean;
    users: UserDto[];
    permissions: any[];
    loading: boolean = true;
    loadingPermission: boolean;
    item: DepartmentDto = new DepartmentDto();

    userService: UserService;
    @ViewChild('viewChoiceUser') viewChoiceUser: ViewChoiceUserComponent;

    constructor() {
        super();
        this.userService = AppInjector.get(UserService);
        this.service = AppInjector.get(AdminApiService);
        this.dialogService = AppInjector.get(AdminDialogService);

        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.getParam('id');
        this.viewer = this.getParam('viewer');
        if (!this.popup) {
            if (this.state) {
                this.id = this.id || this.state.id;
                this.addBreadcrumb(this.id ? 'Edit Department' : 'Add Department');
            }
            this.renderActions();
        }
        this.loadAllUsersByDepartmentId();
        await this.loadItem();
        this.loading = false;
    }

    public async confirmAndBack() {
        let result = await this.confirm();
        if (result) {
            this.back();
        }
    }

    public async confirmAndReset() {
        let result = await this.confirm();
        if (result) {
            this.state.id = null;
            this.item = new DepartmentDto();
            this.router.navigate(['/admin/department/add'], { state: { params: JSON.stringify(this.state) } });
        }
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                this.processing = true;
                let obj: DepartmentDto = _.cloneDeep(this.item);
                obj.UserIds = this.viewChoiceUser.items && this.viewChoiceUser.items.map(c => c.Id);
                return await this.service.callApiUrl('department/addorupdate', obj, MethodType.Put).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Data saved successfully');
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
        this.item = new DepartmentDto();
        if (this.id) {
            await this.service.item('department', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(DepartmentDto, result.Object as DepartmentDto);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }

    private async renderActions() {
        let actions: ActionData[] = this.id
            ? [
                ActionData.back(() => { this.back() }),
                ActionData.saveUpdate('Save Changes', () => { this.confirmAndBack() }),
                ActionData.history(() => { this.viewHistory(this.item.Id, 'Department') })
            ]
            : [
                ActionData.back(() => { this.back() }),
                ActionData.saveAddNew('Add Department', () => { this.confirmAndBack() })
            ];
        this.actions = await this.authen.actionsAllow(DepartmentEntity, actions);
    }

    private async loadAllUsersByDepartmentId() {
        if (this.id) {
            await this.userService.allUsersByDepartmentId(this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.users = result.Object as UserDto[];
                }
            });
        }
    }
}
