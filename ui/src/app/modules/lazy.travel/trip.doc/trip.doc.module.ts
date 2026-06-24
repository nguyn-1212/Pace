import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { TripDocEntity } from '../../../_app.core/domains/entities/trip.doc.entity';
import { EditTripDocComponent } from './edit.trip.doc/edit.trip.doc.component';
@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class TripDocComponent extends GridComponent {
    obj: GridData = { Reference: TripDocEntity, Size: ModalSizeType.Large, Imports: [], Exports: [], Properties: ['Id','TripId','Title','Type','ForUserId','CreatedDate'], Features: [ActionData.reload(() => this.loadItems())] };
    constructor() { super(); this.render(this.obj); }
    addNew() { const o: NavigationStateData = { prevUrl: '/admin/tripdoc', prevData: this.itemData }; this.router.navigate(['/admin/tripdoc/add'], { state: { params: JSON.stringify(o) } }); }
    edit(item: TripDocEntity) { const o: NavigationStateData = { id: item.Id, prevUrl: '/admin/tripdoc', prevData: this.itemData }; this.router.navigate(['/admin/tripdoc/edit'], { state: { params: JSON.stringify(o) } }); }
    view(item: TripDocEntity) { const o: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/tripdoc', prevData: this.itemData }; this.router.navigate(['/admin/tripdoc/view'], { state: { params: JSON.stringify(o) } }); }
}
@NgModule({
    declarations: [TripDocComponent, EditTripDocComponent],
    imports: [UtilityModule, RouterModule.forChild([
        { path: '', component: TripDocComponent, pathMatch: 'full', data: { state: 'tripdoc' }, canActivate: [AdminAuthGuard] },
        { path: 'add', component: EditTripDocComponent, pathMatch: 'full', data: { state: 'add_tripdoc' }, canActivate: [AdminAuthGuard] },
        { path: 'edit', component: EditTripDocComponent, pathMatch: 'full', data: { state: 'edit_tripdoc' }, canActivate: [AdminAuthGuard] },
        { path: 'view', component: EditTripDocComponent, pathMatch: 'full', data: { state: 'view_tripdoc' }, canActivate: [AdminAuthGuard] },
    ])]
})
export class TripDocModule {}
