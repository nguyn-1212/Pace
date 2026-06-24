import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { UserDto } from '../../../../core/domains/objects/user.dto';
import { ResultApi } from '../../../../core/domains/data/result.api';
import { ToastrHelper } from '../../../../core/helpers/toastr.helper';
import { EntityHelper } from '../../../../core/helpers/entity.helper';
import { ActionData } from '../../../../core/domains/data/action.data';
import { AdminApiService } from '../../../../core/services/admin.api.service';
import { UserService } from '../../../../modules/sercurity/user/user.service';
import { ModalSizeType } from '../../../../core/domains/enums/modal.size.type';
import { EditComponent } from '../../../../core/components/edit/edit.component';
import { DepartmentDto } from '../../../../core/domains/objects/department.dto';
import { AdminDialogService } from '../../../../core/services/admin.dialog.service';
import { NavigationStateData } from '../../../../core/domains/data/navigation.state';
import { DepartmentEntity } from '../../../../core/domains/entities/department.entity';
import { ChoiceUserComponent } from '../../../../modules/sercurity/user/choice.user/choice.user.component';

@Component({
    templateUrl: './view.department.component.html',
    styleUrls: [
        './view.department.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class ViewDepartmentComponent extends EditComponent implements OnInit {
    id: number;
    popup: boolean;
    users: UserDto[];
    loading: boolean = true;
    item: DepartmentDto = new DepartmentDto();

    userService: UserService;

    constructor() {
        super();
        this.service = AppInjector.get(AdminApiService);
        this.userService = AppInjector.get(UserService);
        this.dialogService = AppInjector.get(AdminDialogService);

        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.getParam('id');
        this.popup = this.getParam('popup');
        this.viewer = this.getParam('viewer');
        if (!this.popup) {
            if (this.state) {
                this.id = this.id || this.state.id;
                this.addBreadcrumb('View Department Details');
            }
            this.renderActions();
        }
        this.loadAllUsersByDepartmentId();
        await this.loadItem();
        this.loading = false;
    }

    edit(item: DepartmentDto) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevUrl: '/admin/department',
            prevData: this.state.prevData,
        };
        this.router.navigate(['/admin/department/edit'], { state: { params: JSON.stringify(obj) } });
    }

    openPopupEditMember() {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: 'Employees',
            confirmText: 'Save Changes',
            object: ChoiceUserComponent,
            size: ModalSizeType.ExtraLarge,
            objectExtra: { id: this.item.Id, type: 'department' },
        }, async () => {
            this.loadAllUsersByDepartmentId();
        });
    }

    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
            ActionData.gotoEdit("Edit Department", () => { this.edit(this.item) }),
            ActionData.history(() => { this.viewHistory(this.item.Id, 'department') })
        ];
        this.actions = await this.authen.actionsAllow(DepartmentEntity, actions);
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
