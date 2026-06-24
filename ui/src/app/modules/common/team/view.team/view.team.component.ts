import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { TeamDto } from '../../../../core/domains/objects/team.dto';
import { UserDto } from '../../../../core/domains/objects/user.dto';
import { ResultApi } from '../../../../core/domains/data/result.api';
import { ToastrHelper } from '../../../../core/helpers/toastr.helper';
import { EntityHelper } from '../../../../core/helpers/entity.helper';
import { ActionData } from '../../../../core/domains/data/action.data';
import { TeamEntity } from '../../../../core/domains/entities/team.entity';
import { AdminApiService } from '../../../../core/services/admin.api.service';
import { UserService } from '../../../../modules/sercurity/user/user.service';
import { EditComponent } from '../../../../core/components/edit/edit.component';
import { AdminDialogService } from '../../../../core/services/admin.dialog.service';
import { NavigationStateData } from '../../../../core/domains/data/navigation.state';

@Component({
    templateUrl: './view.team.component.html',
    styleUrls: [
        './view.team.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class ViewTeamComponent extends EditComponent implements OnInit {
    id: number;
    popup: boolean;
    users: UserDto[];
    loading: boolean = true;
    userService: UserService;
    item: TeamDto = new TeamDto();

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

    edit(item: TeamDto) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevUrl: '/admin/team',
            prevData: this.state.prevData,
        };
        this.router.navigate(['/admin/team/edit'], { state: { params: JSON.stringify(obj) } });
    }

    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
            ActionData.gotoEdit(this.translate.transform('Core.ActionType.Edit'), () => { this.edit(this.item) }),
            ActionData.history(() => { this.viewHistory(this.item.Id, 'team') })
        ];
        this.actions = await this.authen.actionsAllow(TeamEntity, actions);
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
