import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../core/decorators/validator';
import { TeamDto } from '../../../../core/domains/objects/team.dto';
import { UserDto } from '../../../../core/domains/objects/user.dto';
import { ResultApi } from '../../../../core/domains/data/result.api';
import { ToastrHelper } from '../../../../core/helpers/toastr.helper';
import { EntityHelper } from '../../../../core/helpers/entity.helper';
import { ActionData } from '../../../../core/domains/data/action.data';
import { ButtonType } from '../../../../core/domains/enums/button.type';
import { MethodType } from '../../../../core/domains/enums/method.type';
import { TeamEntity } from '../../../../core/domains/entities/team.entity';
import { UserService } from '../../../../modules/sercurity/user/user.service';
import { AdminApiService } from '../../../../core/services/admin.api.service';
import { EditComponent } from '../../../../core/components/edit/edit.component';
import { PermissionDto } from '../../../../core/domains/objects/permission.dto';
import { AdminDialogService } from '../../../../core/services/admin.dialog.service';
import { ViewChoiceUserComponent } from '../../../../modules/sercurity/user/choice.user/view.choice.user.component';

@Component({
    templateUrl: './edit.team.component.html',
    styleUrls: [
        './edit.team.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditTeamComponent extends EditComponent implements OnInit {

    id: number;
    popup: boolean;
    users: UserDto[];
    permissions: any[];
    items: PermissionDto[];
    loading: boolean = true;
    ButtonType = ButtonType;
    loadingPermission: boolean;
    item: TeamDto = new TeamDto();

    userService: UserService;
    @ViewChild('viewChoiceUser') viewChoiceUser: ViewChoiceUserComponent;

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
                this.addBreadcrumb(this.translate.transform('Core.ActionType.' + (this.id ? (this.viewer ? 'View' : 'Edit') : 'AddNew')));
            }
            this.renderActions();
        }
        this.loadAllUsersByTeamId();
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
            this.item = new TeamDto();
            this.router.navigate(['/admin/team/add'], { state: { params: JSON.stringify(this.state) } });
        }
    }

    public async confirm(): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                this.processing = true;
                let obj: TeamDto = _.cloneDeep(this.item);
                obj.UserIds = this.viewChoiceUser.items && this.viewChoiceUser.items.map(c => c.Id);
                return await this.service.callApiUrl('team/addorupdate', obj, MethodType.Put).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success(this.translate.transform('TeamEntity.SaveSuccessMessage'));
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
        this.item = new TeamDto();
        if (this.id) {
            await this.service.item('team', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(TeamDto, result.Object as TeamDto);
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
                ActionData.history(() => { this.viewHistory(this.item.Id, 'Team') }),
                ActionData.saveUpdate(this.translate.transform('Core.ActionType.Save'), () => { this.confirmAndBack() }),
            ]
            : [
                ActionData.back(() => { this.back() }),
                ActionData.saveAddNew(this.translate.transform('Core.ActionType.AddNew'), () => { this.confirmAndBack() })
            ];
        this.actions = await this.authen.actionsAllow(TeamEntity, actions);
    }

    private async loadAllUsersByTeamId() {
        if (this.id) {
            await this.userService.allUsersByTeamId(this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.users = result.Object as UserDto[];
                }
            });
        }
    }
}
