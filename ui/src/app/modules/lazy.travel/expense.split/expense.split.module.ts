import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { ExpenseSplitEntity } from '../../../_app.core/domains/entities/expense.split.entity';
import { EditExpenseSplitComponent } from './edit.expense.split/edit.expense.split.component';

@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class ExpenseSplitComponent extends GridComponent {
    obj: GridData = {
        Reference: ExpenseSplitEntity,
        Size: ModalSizeType.Medium,
        Properties: ['Id','ExpenseId','UserId','Amount','IsPaid'],
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
            title: 'Thêm Chi tiết chia tiền',
            size: ModalSizeType.Medium,
            cancelText: 'Đóng',
            confirmText: 'Lưu',
            object: EditExpenseSplitComponent,
            objectExtra: { popup: true },
        }, async () => { await this.loadItems(); });
    }

    edit(item: ExpenseSplitEntity) {
        this.dialogService.WapperAsync({
            title: 'Chỉnh sửa Chi tiết chia tiền',
            size: ModalSizeType.Medium,
            cancelText: 'Đóng',
            confirmText: 'Lưu',
            object: EditExpenseSplitComponent,
            objectExtra: { id: item.Id, popup: true },
        }, async () => { await this.loadItems(); });
    }
}

@NgModule({
    declarations: [ExpenseSplitComponent, EditExpenseSplitComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: ExpenseSplitComponent, pathMatch: 'full', data: { state: 'expensesplit' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class ExpenseSplitModule {}

