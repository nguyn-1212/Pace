import { UserService } from './user.service';
import { RouterModule } from '@angular/router';
import { ShareModule } from '../../share.module';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { DataType } from '../../../core/domains/enums/data.type';
import { ResultApi } from '../../../core/domains/data/result.api';
import { ToastrHelper } from '../../../core/helpers/toastr.helper';
import { LockUserComponent } from './lock.user/lock.user.component';
import { EditUserComponent } from './edit.user/edit.user.component';
import { ViewUserComponent } from './view.user/view.user.component';
import { ActionData } from '../../../core/domains/data/action.data';
import { ActionType } from '../../../core/domains/enums/action.type';
import { StatusType } from '../../../core/domains/enums/status.type';
import { UtilityExHelper } from '../../../core/helpers/utility.helper';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { UserEditRoleComponent } from './_components/edit.role.component';
import { UserViewRoleComponent } from './_components/view.role.component';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from "../../../_app.core/guards/admin.auth.guard";
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { UserEditRolePermissionComponent } from './_components/edit.role.permission.component';

@Component({
    templateUrl: '../../../core/components/grid/grid.component.html',
})
export class UserComponent extends GridComponent {
    obj: GridData = {
        Exports: [],
        Imports: [],
        Actions: [
            {
                icon: 'la la-eye',
                name: ActionType.ViewDetail,
                className: 'btn btn-warning',
                systemName: ActionType.ViewDetail,
                click: (item: any) => {
                    this.view(item);
                }
            },
            {
                icon: 'la la-pencil',
                name: ActionType.Edit,
                systemName: ActionType.Edit,
                className: 'btn btn-primary',
                click: (item: any) => {
                    this.edit(item);
                }
            },
            ActionData.delete((item: any) => this.delete(item))
        ],
        MoreActions: [
            {
                icon: 'la la-lock',
                name: 'Setup Password',
                systemName: ActionType.ResetPassword,
                click: (item: any) => {
                    let email = item.Email;
                    this.dialogService.ConfirmAsync(
                        'Do you want to reset the password for account: <b>' + email + '</b>?',
                        async () => {
                            await this.service.callApiUrl('/user/resetPassword', { Email: email }).then((result: ResultApi) => {
                                if (ResultApi.IsSuccess(result)) {
                                    this.dialogService.Alert('Notification', 'The new password is: ' + result.Object);
                                } else {
                                    ToastrHelper.ErrorResult(result);
                                }
                            });
                        },
                        null,
                        'Reset Password'
                    );
                }
            },
            {
                icon: 'la la-unlock',
                name: 'Core.ActionType.UnLock',
                systemName: ActionType.UnLock,
                hidden: ((item: any) => {
                    return !(item.LockStatus);
                }),
                click: ((item: any) => {
                    this.dialogService.ConfirmAsync('Confirm unlocking account <b>' + item.Name + '</b>', async () => {
                        await this.apiService.unLockUser(item.Id).then((result: ResultApi) => {
                            if (ResultApi.IsSuccess(result)) {
                                ToastrHelper.Success('Account unlocked successfully');
                                this.loadItems();
                            } else ToastrHelper.ErrorResult(result);
                        });
                    });
                })
            },
            {
                icon: 'la la-lock',
                name: 'Core.ActionType.Lock',
                systemName: ActionType.Lock,
                hidden: ((item: any) => {
                    return item.LockStatus;
                }),
                click: (async (item: UserEntity) => {
                    this.dialogService.WapperAsync({
                        cancelText: 'Close',
                        confirmText: 'Confirm',
                        object: LockUserComponent,
                        size: ModalSizeType.Large,
                        objectExtra: { id: item.Id },
                        title: 'Lock employee account',
                    }, async () => {
                        this.loadItems();
                    });
                })
            }
        ],
        Title: 'Users',
        Reference: UserEntity,
        SearchText: 'Enter name, email, or phone number',
    };

    constructor(public apiService: UserService) {
        super();
        this.properties = [
            { Property: 'Id', Title: 'Id', Type: DataType.Number },
            {
                Property: 'FullName', Title: 'User Info',
                Format: ((item: any) => {
                    item.Name = item.FullName;
                    let text = '<a routerLink="view">' + UtilityExHelper.escapeHtml(item.FullName) + '</a>';
                    if (item.Phone) text += '<p><i class=\'la la-phone\'></i> ' + item.Phone + '</p>';
                    if (item.Email) text += '<p><i class=\'la la-inbox\'></i> ' + item.Email + '</p>';
                    return text;
                })
            },
            { Property: 'Gender' },
            { Property: 'Birthday' },
            { Property: 'Role', Title: 'Role' },
            {
                Property: 'Locked', Title: 'Status', Align: 'center',
                Format: ((item: any) => {
                    item.LockStatus = item.Locked ? true : false;
                    let text = item.Locked ? 'Locked' : 'Active',
                        status = item.Locked ? StatusType.Warning : StatusType.Success;
                    return UtilityExHelper.formatText(text, status);
                })
            },
        ];
        this.render(this.obj);
    }

    addNew() {
        let obj: NavigationStateData = {
            prevUrl: '/admin/user',
            prevData: this.itemData,
        };
        this.router.navigate(['/admin/user/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: UserEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevUrl: '/admin/user',
            prevData: this.itemData,
        };
        this.router.navigate(['/admin/user/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: UserEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevUrl: '/admin/user',
            prevData: this.itemData,
        };
        this.router.navigate(['/admin/user/view'], { state: { params: JSON.stringify(obj) } });
    }
}

@NgModule({
    declarations: [
        UserComponent,
        LockUserComponent,
        EditUserComponent,
        UserViewRoleComponent,
        UserEditRoleComponent,
        UserEditRolePermissionComponent
    ],
    imports: [
        ShareModule,
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: UserComponent, pathMatch: 'full', data: { state: 'user' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditUserComponent, pathMatch: 'full', data: { state: 'add_user' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditUserComponent, pathMatch: 'full', data: { state: 'edit_user' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: ViewUserComponent, pathMatch: 'full', data: { state: 'view_user' }, canActivate: [AdminAuthGuard] },
        ])
    ],
    providers: [UserService]
})
export class UserModule { }