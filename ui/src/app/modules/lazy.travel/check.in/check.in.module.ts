import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { CheckInEntity } from '../../../_app.core/domains/entities/check.in.entity';
import { EditCheckInComponent } from './edit.check.in/edit.check.in.component';
@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class CheckInComponent extends GridComponent {
    obj: GridData = { Reference: CheckInEntity, Size: ModalSizeType.Large, Imports: [], Exports: [], Properties: ['Id','TripId','UserId','PlaceId','PlaceName','CheckInTime'], Features: [ActionData.reload(() => this.loadItems())] };
    constructor() { super(); this.render(this.obj); }
    addNew() { const o: NavigationStateData = { prevUrl: '/admin/checkin', prevData: this.itemData }; this.router.navigate(['/admin/checkin/add'], { state: { params: JSON.stringify(o) } }); }
    edit(item: CheckInEntity) { const o: NavigationStateData = { id: item.Id, prevUrl: '/admin/checkin', prevData: this.itemData }; this.router.navigate(['/admin/checkin/edit'], { state: { params: JSON.stringify(o) } }); }
    view(item: CheckInEntity) { const o: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/checkin', prevData: this.itemData }; this.router.navigate(['/admin/checkin/view'], { state: { params: JSON.stringify(o) } }); }
}
@NgModule({
    declarations: [CheckInComponent, EditCheckInComponent],
    imports: [UtilityModule, RouterModule.forChild([
        { path: '', component: CheckInComponent, pathMatch: 'full', data: { state: 'checkin' }, canActivate: [AdminAuthGuard] },
        { path: 'add', component: EditCheckInComponent, pathMatch: 'full', data: { state: 'add_checkin' }, canActivate: [AdminAuthGuard] },
        { path: 'edit', component: EditCheckInComponent, pathMatch: 'full', data: { state: 'edit_checkin' }, canActivate: [AdminAuthGuard] },
        { path: 'view', component: EditCheckInComponent, pathMatch: 'full', data: { state: 'view_checkin' }, canActivate: [AdminAuthGuard] },
    ])]
})
export class CheckInModule {}
