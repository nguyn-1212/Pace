import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { ExpenseEntity } from '../../../_app.core/domains/entities/expense.entity';
import { EditExpenseComponent } from './edit.expense/edit.expense.component';

@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class ExpenseComponent extends GridComponent {
    obj: GridData = {
        Reference: ExpenseEntity,
        Size: ModalSizeType.Large,
        Imports: [], Exports: [],
        Properties: ['Id','TripId','Title','Category','Amount','Currency','PaidBy','SplitType','Date'],
        Features: [ActionData.reload(() => this.loadItems())],
    };
    constructor() { super(); this.render(this.obj); }
    addNew() {
        const obj: NavigationStateData = { prevUrl: '/admin/expense', prevData: this.itemData };
        this.router.navigate(['/admin/expense/add'], { state: { params: JSON.stringify(obj) } });
    }
    edit(item: ExpenseEntity) {
        const obj: NavigationStateData = { id: item.Id, prevUrl: '/admin/expense', prevData: this.itemData };
        this.router.navigate(['/admin/expense/edit'], { state: { params: JSON.stringify(obj) } });
    }
    view(item: ExpenseEntity) {
        const obj: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/expense', prevData: this.itemData };
        this.router.navigate(['/admin/expense/view'], { state: { params: JSON.stringify(obj) } });
    }
}
@NgModule({
    declarations: [ExpenseComponent, EditExpenseComponent],
    imports: [UtilityModule, RouterModule.forChild([
        { path: '', component: ExpenseComponent, pathMatch: 'full', data: { state: 'expense' }, canActivate: [AdminAuthGuard] },
        { path: 'add', component: EditExpenseComponent, pathMatch: 'full', data: { state: 'add_expense' }, canActivate: [AdminAuthGuard] },
        { path: 'edit', component: EditExpenseComponent, pathMatch: 'full', data: { state: 'edit_expense' }, canActivate: [AdminAuthGuard] },
        { path: 'view', component: EditExpenseComponent, pathMatch: 'full', data: { state: 'view_expense' }, canActivate: [AdminAuthGuard] },
    ])]
})
export class ExpenseModule {}
