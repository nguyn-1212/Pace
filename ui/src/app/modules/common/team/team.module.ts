import { RouterModule } from "@angular/router";
import { ShareModule } from "../../share.module";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../core/domains/data/grid.data";
import { DataType } from "../../../core/domains/enums/data.type";
import { ViewTeamComponent } from "./view.team/view.team.component";
import { EditTeamComponent } from "./edit.team/edit.team.component";
import { ActionData } from "../../../core/domains/data/action.data";
import { ActionType } from "../../../core/domains/enums/action.type";
import { UtilityExHelper } from "../../../core/helpers/utility.helper";
import { TeamEntity } from "../../../core/domains/entities/team.entity";
import { BaseEntity } from "../../../core/domains/entities/base.entity";
import { ModalSizeType } from "../../../core/domains/enums/modal.size.type";
import { AdminAuthGuard } from "../../../_app.core/guards/admin.auth.guard";
import { GridComponent } from "../../../core/components/grid/grid.component";
import { ChoiceUserComponent } from "../../sercurity/user/choice.user/choice.user.component";
import { ViewChoiceUserComponent } from "../../sercurity/user/choice.user/view.choice.user.component";

@Component({
    templateUrl: '../../../core/components/grid/grid.component.html',
})
export class TeamComponent extends GridComponent {
    obj: GridData = {
        Reference: TeamEntity,
        Filters: [],
        Imports: [],
        Exports: [],
        UpdatedBy: false,
        Navigation: true,
        Actions: [
            ActionData.edit((item: any) => {
                this.edit(item);
            }),
            ActionData.delete((item: any) => {
                this.trash(item);
            })
        ],
        Size: ModalSizeType.Medium,
        InlineFilters: ['OrganizationId'],
        MoreActions: [
            {
                icon: 'la la-users',
                name: ActionType.EditMember,
                systemName: ActionType.EditMember,
                click: ((item: TeamEntity) => {
                    this.popupChoiceUser(item);
                })
            },
            ActionData.history((item: TeamEntity) => {
                this.viewHistory(item.Id);
            })
        ],
        SearchText: this.translate.transform('TeamEntity.SearchText')
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            {
                Property: 'Name', Type: DataType.String,
                Format: ((item: any) => {
                    return '<a routerLink="view">' + UtilityExHelper.escapeHtml(item.Name) + '</a>';
                })
            },
            { Property: 'Code', Type: DataType.String },
            { Property: 'Description', Type: DataType.String },
            {
                Property: 'Amount', Type: DataType.String, Align: 'center',
                Click: ((item: TeamEntity) => {
                    this.popupViewChoiceUser(item);
                }),
                Format: ((item: any) => {
                    return item.Amount + ' ' + this.translate.transform('BaseEntity.Employee')
                })
            }
        ];
        this.render(this.obj);
    }

    private popupChoiceUser(item: BaseEntity) {
        this.dialogService.WapperAsync({
            object: ChoiceUserComponent,
            size: ModalSizeType.ExtraLarge,
            title: this.translate.transform('TeamEntity.AddNewMember'),
            cancelText: this.translate.transform('Core.ActionType.Close'),
            confirmText: this.translate.transform('TeamEntity.ChoiceMember'),
            objectExtra: {
                id: item.Id,
                autoSave: true,
                navigation: true,
                type: this.obj.ReferenceName,
            },
        }, async () => {
            this.loadItems();
        });
    }
    private popupViewChoiceUser(item: BaseEntity) {
        let addUser = this.authen.permissionAllow(this.obj.ReferenceName, ActionType.EditMember),
            deleteUser = this.authen.permissionAllow(this.obj.ReferenceName, ActionType.EditMember);
        this.dialogService.WapperAsync({
            size: ModalSizeType.ExtraLarge,
            object: ViewChoiceUserComponent,
            title: this.translate.transform('TeamEntity.ViewMember'),
           cancelText: this.translate.transform('Core.ActionType.Close'),
            confirmText: this.translate.transform('Core.ActionType.Save'),
            objectExtra: {
                id: item.Id,
                autoSave: true,
                type: this.obj.ReferenceName,
                addUser: addUser,
                navigation: true,
                deleteUser: deleteUser,
                choiceComplete: () => {
                    this.loadItems();
                }
            },
        }, async () => {
            this.loadItems();
        });
    }
}

@NgModule({
    declarations: [
        TeamComponent,
        EditTeamComponent,
        ViewTeamComponent,
    ],
    imports: [
        ShareModule,
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: TeamComponent, pathMatch: 'full', data: { state: 'team' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditTeamComponent, pathMatch: 'full', data: { state: 'add_team' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditTeamComponent, pathMatch: 'full', data: { state: 'edit_team' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: ViewTeamComponent, pathMatch: 'full', data: { state: 'view_team' }, canActivate: [AdminAuthGuard] },
        ])
    ],
})
export class TeamModule { }