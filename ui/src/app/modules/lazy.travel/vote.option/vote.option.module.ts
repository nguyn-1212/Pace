import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { VoteOptionEntity } from '../../../_app.core/domains/entities/vote.option.entity';
import { EditVoteOptionComponent } from './edit.vote.option/edit.vote.option.component';

@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class VoteOptionComponent extends GridComponent {
    obj: GridData = {
        Reference: VoteOptionEntity,
        Size: ModalSizeType.Medium,
        Properties: ['Id','VoteId','Label','Emoji','OrderIndex'],
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
            title: 'Thêm Lựa chọn bình chọn',
            size: ModalSizeType.Medium,
            cancelText: 'Đóng',
            confirmText: 'Lưu',
            object: EditVoteOptionComponent,
            objectExtra: { popup: true },
        }, async () => { await this.loadItems(); });
    }

    edit(item: VoteOptionEntity) {
        this.dialogService.WapperAsync({
            title: 'Chỉnh sửa Lựa chọn bình chọn',
            size: ModalSizeType.Medium,
            cancelText: 'Đóng',
            confirmText: 'Lưu',
            object: EditVoteOptionComponent,
            objectExtra: { id: item.Id, popup: true },
        }, async () => { await this.loadItems(); });
    }
}

@NgModule({
    declarations: [VoteOptionComponent, EditVoteOptionComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: VoteOptionComponent, pathMatch: 'full', data: { state: 'voteoption' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class VoteOptionModule {}

