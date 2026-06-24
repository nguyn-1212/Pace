import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { PlaceReviewEntity } from '../../../_app.core/domains/entities/place.review.entity';
import { EditPlaceReviewComponent } from './edit.place.review/edit.place.review.component';

@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class PlaceReviewComponent extends GridComponent {
    obj: GridData = {
        Reference: PlaceReviewEntity,
        Size: ModalSizeType.Medium,
        Properties: ['Id','PlaceId','UserId','Rating','Comment'],
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
            title: 'Thêm Đánh giá địa điểm',
            size: ModalSizeType.Medium,
            cancelText: 'Đóng',
            confirmText: 'Lưu',
            object: EditPlaceReviewComponent,
            objectExtra: { popup: true },
        }, async () => { await this.loadItems(); });
    }

    edit(item: PlaceReviewEntity) {
        this.dialogService.WapperAsync({
            title: 'Chỉnh sửa Đánh giá địa điểm',
            size: ModalSizeType.Medium,
            cancelText: 'Đóng',
            confirmText: 'Lưu',
            object: EditPlaceReviewComponent,
            objectExtra: { id: item.Id, popup: true },
        }, async () => { await this.loadItems(); });
    }
}

@NgModule({
    declarations: [PlaceReviewComponent, EditPlaceReviewComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: PlaceReviewComponent, pathMatch: 'full', data: { state: 'placereview' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class PlaceReviewModule {}

