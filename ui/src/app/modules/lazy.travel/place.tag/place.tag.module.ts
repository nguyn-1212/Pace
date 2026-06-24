import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { PlaceTagEntity } from '../../../_app.core/domains/entities/place.tag.entity';
import { EditPlaceTagComponent } from './edit.place.tag/edit.place.tag.component';

@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class PlaceTagComponent extends GridComponent {
    obj: GridData = {
        Reference: PlaceTagEntity,
        Size: ModalSizeType.Medium,
        Properties: ['Id','PlaceId','Tag','TagType','Priority'],
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
            title: 'Thêm Tag địa điểm',
            size: ModalSizeType.Medium,
            cancelText: 'Đóng',
            confirmText: 'Lưu',
            object: EditPlaceTagComponent,
            objectExtra: { popup: true },
        }, async () => { await this.loadItems(); });
    }

    edit(item: PlaceTagEntity) {
        this.dialogService.WapperAsync({
            title: 'Chỉnh sửa Tag địa điểm',
            size: ModalSizeType.Medium,
            cancelText: 'Đóng',
            confirmText: 'Lưu',
            object: EditPlaceTagComponent,
            objectExtra: { id: item.Id, popup: true },
        }, async () => { await this.loadItems(); });
    }
}

@NgModule({
    declarations: [PlaceTagComponent, EditPlaceTagComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: PlaceTagComponent, pathMatch: 'full', data: { state: 'placetag' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class PlaceTagModule {}

