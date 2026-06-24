import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { UserBadgeEntity } from '../../../_app.core/domains/entities/user.badge.entity';
import { EditUserBadgeComponent } from './edit.user.badge/edit.user.badge.component';

@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class UserBadgeComponent extends GridComponent {
    obj: GridData = {
        Reference: UserBadgeEntity,
        Size: ModalSizeType.Medium,
        Properties: ['Id','UserId','BadgeType','EarnedDate'],
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
            title: 'Thêm Huy hiệu',
            size: ModalSizeType.Medium,
            cancelText: 'Đóng',
            confirmText: 'Lưu',
            object: EditUserBadgeComponent,
            objectExtra: { popup: true },
        }, async () => { await this.loadItems(); });
    }

    edit(item: UserBadgeEntity) {
        this.dialogService.WapperAsync({
            title: 'Chỉnh sửa Huy hiệu',
            size: ModalSizeType.Medium,
            cancelText: 'Đóng',
            confirmText: 'Lưu',
            object: EditUserBadgeComponent,
            objectExtra: { id: item.Id, popup: true },
        }, async () => { await this.loadItems(); });
    }
}

@NgModule({
    declarations: [UserBadgeComponent, EditUserBadgeComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: UserBadgeComponent, pathMatch: 'full', data: { state: 'userbadge' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class UserBadgeModule {}

