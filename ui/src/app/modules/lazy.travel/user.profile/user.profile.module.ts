import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { UserProfileEntity } from '../../../_app.core/domains/entities/user.profile.entity';
import { EditUserProfileComponent } from './edit.user.profile/edit.user.profile.component';

@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class UserProfileComponent extends GridComponent {
    obj: GridData = {
        Reference: UserProfileEntity,
        Size: ModalSizeType.Medium,
        Properties: ['Id','UserId','Bio','TravelStyle','HomeCity','IsPublic'],
        Imports: [],
        Exports: [],
        Features: [ActionData.reload(() => this.loadItems())],
    };

    constructor() {
        super();
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            title: 'Thêm Hồ sơ người dùng',
            size: ModalSizeType.Medium,
            cancelText: 'Đóng',
            confirmText: 'Lưu',
            object: EditUserProfileComponent,
            objectExtra: { popup: true },
        }, async () => { await this.loadItems(); });
    }

    edit(item: UserProfileEntity) {
        this.dialogService.WapperAsync({
            title: 'Chỉnh sửa Hồ sơ người dùng',
            size: ModalSizeType.Medium,
            cancelText: 'Đóng',
            confirmText: 'Lưu',
            object: EditUserProfileComponent,
            objectExtra: { id: item.Id, popup: true },
        }, async () => { await this.loadItems(); });
    }
}

@NgModule({
    declarations: [UserProfileComponent, EditUserProfileComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: UserProfileComponent, pathMatch: 'full', data: { state: 'userprofile' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class UserProfileModule {}

