import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { TripAnnouncementEntity } from '../../../_app.core/domains/entities/trip.announcement.entity';
import { EditTripAnnouncementComponent } from './edit.trip.announcement/edit.trip.announcement.component';
@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class TripAnnouncementComponent extends GridComponent {
    obj: GridData = { Reference: TripAnnouncementEntity, Size: ModalSizeType.Large, Imports: [], Exports: [], Properties: ['Id','TripId','Title','Priority','CreatedDate'], Features: [ActionData.reload(() => this.loadItems())] };
    constructor() { super(); this.render(this.obj); }
    addNew() { const o: NavigationStateData = { prevUrl: '/admin/tripannouncement', prevData: this.itemData }; this.router.navigate(['/admin/tripannouncement/add'], { state: { params: JSON.stringify(o) } }); }
    edit(item: TripAnnouncementEntity) { const o: NavigationStateData = { id: item.Id, prevUrl: '/admin/tripannouncement', prevData: this.itemData }; this.router.navigate(['/admin/tripannouncement/edit'], { state: { params: JSON.stringify(o) } }); }
    view(item: TripAnnouncementEntity) { const o: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/tripannouncement', prevData: this.itemData }; this.router.navigate(['/admin/tripannouncement/view'], { state: { params: JSON.stringify(o) } }); }
}
@NgModule({
    declarations: [TripAnnouncementComponent, EditTripAnnouncementComponent],
    imports: [UtilityModule, RouterModule.forChild([
        { path: '', component: TripAnnouncementComponent, pathMatch: 'full', data: { state: 'tripannouncement' }, canActivate: [AdminAuthGuard] },
        { path: 'add', component: EditTripAnnouncementComponent, pathMatch: 'full', data: { state: 'add_tripannouncement' }, canActivate: [AdminAuthGuard] },
        { path: 'edit', component: EditTripAnnouncementComponent, pathMatch: 'full', data: { state: 'edit_tripannouncement' }, canActivate: [AdminAuthGuard] },
        { path: 'view', component: EditTripAnnouncementComponent, pathMatch: 'full', data: { state: 'view_tripannouncement' }, canActivate: [AdminAuthGuard] },
    ])]
})
export class TripAnnouncementModule {}
