import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { ExpenseSettlementEntity } from '../../../_app.core/domains/entities/expense.settlement.entity';
import { EditExpenseSettlementComponent } from './edit.expense.settlement/edit.expense.settlement.component';

@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class ExpenseSettlementComponent extends GridComponent {
    obj: GridData = {
        Reference: ExpenseSettlementEntity,
        Size: ModalSizeType.Large,
        Imports: [], Exports: [],
        Properties: ['Id','TripId','FromUserId','ToUserId','Amount','Status','PaidDate'],
        Features: [ActionData.reload(() => this.loadItems())],
    };
    constructor() { super(); this.render(this.obj); }
    addNew() {
        const obj: NavigationStateData = { prevUrl: '/admin/expensesettlement', prevData: this.itemData };
        this.router.navigate(['/admin/expensesettlement/add'], { state: { params: JSON.stringify(obj) } });
    }
    edit(item: ExpenseSettlementEntity) {
        const obj: NavigationStateData = { id: item.Id, prevUrl: '/admin/expensesettlement', prevData: this.itemData };
        this.router.navigate(['/admin/expensesettlement/edit'], { state: { params: JSON.stringify(obj) } });
    }
    view(item: ExpenseSettlementEntity) {
        const obj: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/expensesettlement', prevData: this.itemData };
        this.router.navigate(['/admin/expensesettlement/view'], { state: { params: JSON.stringify(obj) } });
    }
}
@NgModule({
    declarations: [ExpenseSettlementComponent, EditExpenseSettlementComponent],
    imports: [UtilityModule, RouterModule.forChild([
        { path: '', component: ExpenseSettlementComponent, pathMatch: 'full', data: { state: 'expensesettlement' }, canActivate: [AdminAuthGuard] },
        { path: 'add', component: EditExpenseSettlementComponent, pathMatch: 'full', data: { state: 'add_expensesettlement' }, canActivate: [AdminAuthGuard] },
        { path: 'edit', component: EditExpenseSettlementComponent, pathMatch: 'full', data: { state: 'edit_expensesettlement' }, canActivate: [AdminAuthGuard] },
        { path: 'view', component: EditExpenseSettlementComponent, pathMatch: 'full', data: { state: 'view_expensesettlement' }, canActivate: [AdminAuthGuard] },
    ])]
})
export class ExpenseSettlementModule {}
