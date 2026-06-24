import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { TripInviteLinkEntity } from '../../../_app.core/domains/entities/trip.invite.link.entity';
import { EditTripInviteLinkComponent } from './edit.trip.invite.link/edit.trip.invite.link.component';

@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class TripInviteLinkComponent extends GridComponent {
    obj: GridData = {
        Reference: TripInviteLinkEntity,
        Size: ModalSizeType.Medium,
        Properties: ['Id','TripId','Code','ExpiresAt','UsedCount','IsRevoked'],
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
            title: 'Thêm Link mời chuyến đi',
            size: ModalSizeType.Medium,
            cancelText: 'Đóng',
            confirmText: 'Lưu',
            object: EditTripInviteLinkComponent,
            objectExtra: { popup: true },
        }, async () => { await this.loadItems(); });
    }

    edit(item: TripInviteLinkEntity) {
        this.dialogService.WapperAsync({
            title: 'Chỉnh sửa Link mời chuyến đi',
            size: ModalSizeType.Medium,
            cancelText: 'Đóng',
            confirmText: 'Lưu',
            object: EditTripInviteLinkComponent,
            objectExtra: { id: item.Id, popup: true },
        }, async () => { await this.loadItems(); });
    }
}

@NgModule({
    declarations: [TripInviteLinkComponent, EditTripInviteLinkComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: TripInviteLinkComponent, pathMatch: 'full', data: { state: 'tripinvitelink' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class TripInviteLinkModule {}

