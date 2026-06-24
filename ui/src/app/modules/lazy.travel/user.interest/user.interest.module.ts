import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { UserInterestEntity } from '../../../_app.core/domains/entities/user.interest.entity';
import { EditUserInterestComponent } from './edit.user.interest/edit.user.interest.component';

@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class UserInterestComponent extends GridComponent {
    obj: GridData = {
        Reference: UserInterestEntity,
        Size: ModalSizeType.Medium,
        Properties: ['Id','UserId','Interest'],
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
            title: 'Thêm Sở thích',
            size: ModalSizeType.Medium,
            cancelText: 'Đóng',
            confirmText: 'Lưu',
            object: EditUserInterestComponent,
            objectExtra: { popup: true },
        }, async () => { await this.loadItems(); });
    }

    edit(item: UserInterestEntity) {
        this.dialogService.WapperAsync({
            title: 'Chỉnh sửa Sở thích',
            size: ModalSizeType.Medium,
            cancelText: 'Đóng',
            confirmText: 'Lưu',
            object: EditUserInterestComponent,
            objectExtra: { id: item.Id, popup: true },
        }, async () => { await this.loadItems(); });
    }
}

@NgModule({
    declarations: [UserInterestComponent, EditUserInterestComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: UserInterestComponent, pathMatch: 'full', data: { state: 'userinterest' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class UserInterestModule {}

