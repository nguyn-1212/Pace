import { RoleService } from './role.service';
import { RouterModule } from '@angular/router';
import { ShareModule } from '../../share.module';
import { UserService } from '../user/user.service';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { DataType } from '../../../core/domains/enums/data.type';
import { EditRoleComponent } from './edit.role/edit.role.component';
import { ViewRoleComponent } from './view.role/view.role.component';
import { ActionData } from '../../../core/domains/data/action.data';
import { ActionType } from '../../../core/domains/enums/action.type';
import { UtilityExHelper } from "../../../core/helpers/utility.helper";
import { RoleEntity } from '../../../core/domains/entities/role.entity';
import { BaseEntity } from "../../../core/domains/entities/base.entity";
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { ChoiceUserComponent } from '../user/choice.user/choice.user.component';
import { ViewChoiceUserComponent } from '../user/choice.user/view.choice.user.component';
import { EditRolePermissionComponent } from './edit.permission/edit.permission.component';

@Component({
    templateUrl: '../../../core/components/grid/grid.component.html',
})
export class RoleComponent extends GridComponent {
    obj: GridData = {
        Filters: [],
        Imports: [],
        Exports: [],
        Navigation: true,
        Actions: [
            ActionData.edit((item: any) => {
                this.edit(item);
            }),
            ActionData.view((item: any) => {
                this.view(item);
            })
        ],
        MoreActions: [
            {
                icon: 'la la-book',
                name: 'Core.ActionType.Role',
                systemName: ActionType.Role,
                click: ((item: RoleEntity) => {
                    this.editPermission(item);
                })
            },
            {
                icon: 'la la-users',
                name: 'Core.ActionType.EditMember',
                systemName: ActionType.EditMember,
                click: ((item: RoleEntity) => {
                    this.popupChoiceUser(item);
                })
            },
            ActionData.history((item: RoleEntity) => {
                this.viewHistory(item.Id);
            })
        ],
        Reference: RoleEntity,
        SearchText: 'Nhập mã, tên quyền'
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            {
                Property: 'Code', Type: DataType.String,
                Format: ((item: any) => {
                    return '<a routerLink="view">' + UtilityExHelper.escapeHtml(item.Code) + '</a>';
                })
            },
            { Property: 'Name', Type: DataType.String },
            {
                Property: 'Amount', Type: DataType.String, Align: 'center',
                Click: ((item: RoleEntity) => {
                    this.popupViewChoiceUser(item);
                }),
                Format: ((item: any) => {
                    return item.Amount + ' users'
                }),
            },
        ];
        this.render(this.obj);
    }

    editPermission(item: RoleEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: 'Assign Permissions',
            confirmText: 'Save Changes',
            objectExtra: { id: item.Id },
            size: ModalSizeType.ExtraLarge,
            object: EditRolePermissionComponent,
        }, async () => {
            this.loadItems();
        }, null, async () => {
            this.loadItems();
        });
    }

    private popupChoiceUser(item: BaseEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: 'Add User',
            object: ChoiceUserComponent,
            confirmText: 'Select User',
            size: ModalSizeType.ExtraLarge,
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
            cancelText: 'Close',
            confirmText: 'Save Changes',
            size: ModalSizeType.ExtraLarge,
            object: ViewChoiceUserComponent,
            title: 'View Users List',
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
        RoleComponent,
        EditRoleComponent,
        ViewRoleComponent,
        EditRolePermissionComponent
    ],
    imports: [
        ShareModule,
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: RoleComponent, pathMatch: 'full', data: { state: 'role' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditRoleComponent, pathMatch: 'full', data: { state: 'add_role' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditRoleComponent, pathMatch: 'full', data: { state: 'edit_role' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: ViewRoleComponent, pathMatch: 'full', data: { state: 'view_role' }, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [RoleService, UserService]
})
export class RoleModule { }