import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { FriendshipEntity } from '../../../_app.core/domains/entities/friendship.entity';
import { EditFriendshipComponent } from './edit.friendship/edit.friendship.component';

@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class FriendshipComponent extends GridComponent {
    obj: GridData = {
        Reference: FriendshipEntity,
        Size: ModalSizeType.Medium,
        Properties: ['Id','RequesterId','AddresseeId','Status'],
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
            title: 'Thêm Kết bạn',
            size: ModalSizeType.Medium,
            cancelText: 'Đóng',
            confirmText: 'Lưu',
            object: EditFriendshipComponent,
            objectExtra: { popup: true },
        }, async () => { await this.loadItems(); });
    }

    edit(item: FriendshipEntity) {
        this.dialogService.WapperAsync({
            title: 'Chỉnh sửa Kết bạn',
            size: ModalSizeType.Medium,
            cancelText: 'Đóng',
            confirmText: 'Lưu',
            object: EditFriendshipComponent,
            objectExtra: { id: item.Id, popup: true },
        }, async () => { await this.loadItems(); });
    }
}

@NgModule({
    declarations: [FriendshipComponent, EditFriendshipComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: FriendshipComponent, pathMatch: 'full', data: { state: 'friendship' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class FriendshipModule {}

