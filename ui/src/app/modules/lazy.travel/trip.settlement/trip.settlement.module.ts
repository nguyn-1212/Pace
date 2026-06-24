import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { TripSettlementEntity } from '../../../_app.core/domains/entities/trip.settlement.entity';
import { EditTripSettlementComponent } from './edit.trip.settlement/edit.trip.settlement.component';

@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class TripSettlementComponent extends GridComponent {
    obj: GridData = {
        Reference: TripSettlementEntity,
        Size: ModalSizeType.Large,
        Imports: [], Exports: [],
        Properties: ['Id','TripId','Status','LockedBy','LockedDate','TotalAmount'],
        Features: [ActionData.reload(() => this.loadItems())],
    };
    constructor() { super(); this.render(this.obj); }
    addNew() {
        const obj: NavigationStateData = { prevUrl: '/admin/tripsettlement', prevData: this.itemData };
        this.router.navigate(['/admin/tripsettlement/add'], { state: { params: JSON.stringify(obj) } });
    }
    edit(item: TripSettlementEntity) {
        const obj: NavigationStateData = { id: item.Id, prevUrl: '/admin/tripsettlement', prevData: this.itemData };
        this.router.navigate(['/admin/tripsettlement/edit'], { state: { params: JSON.stringify(obj) } });
    }
    view(item: TripSettlementEntity) {
        const obj: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/tripsettlement', prevData: this.itemData };
        this.router.navigate(['/admin/tripsettlement/view'], { state: { params: JSON.stringify(obj) } });
    }
}
@NgModule({
    declarations: [TripSettlementComponent, EditTripSettlementComponent],
    imports: [UtilityModule, RouterModule.forChild([
        { path: '', component: TripSettlementComponent, pathMatch: 'full', data: { state: 'tripsettlement' }, canActivate: [AdminAuthGuard] },
        { path: 'add', component: EditTripSettlementComponent, pathMatch: 'full', data: { state: 'add_tripsettlement' }, canActivate: [AdminAuthGuard] },
        { path: 'edit', component: EditTripSettlementComponent, pathMatch: 'full', data: { state: 'edit_tripsettlement' }, canActivate: [AdminAuthGuard] },
        { path: 'view', component: EditTripSettlementComponent, pathMatch: 'full', data: { state: 'view_tripsettlement' }, canActivate: [AdminAuthGuard] },
    ])]
})
export class TripSettlementModule {}
