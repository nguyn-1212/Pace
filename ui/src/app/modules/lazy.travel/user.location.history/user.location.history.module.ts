import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { UserLocationHistoryEntity } from '../../../_app.core/domains/entities/user.location.history.entity';
import { EditUserLocationHistoryComponent } from './edit.user.location.history/edit.user.location.history.component';
@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class UserLocationHistoryComponent extends GridComponent {
    obj: GridData = { Reference: UserLocationHistoryEntity, Size: ModalSizeType.Large, Imports: [], Exports: [], Properties: ['Id','TripId','UserId','PlaceName','Latitude','Longitude','RecordedAt'], Features: [ActionData.reload(() => this.loadItems())] };
    constructor() { super(); this.render(this.obj); }
    addNew() { const o: NavigationStateData = { prevUrl: '/admin/userlocationhistory', prevData: this.itemData }; this.router.navigate(['/admin/userlocationhistory/add'], { state: { params: JSON.stringify(o) } }); }
    edit(item: UserLocationHistoryEntity) { const o: NavigationStateData = { id: item.Id, prevUrl: '/admin/userlocationhistory', prevData: this.itemData }; this.router.navigate(['/admin/userlocationhistory/edit'], { state: { params: JSON.stringify(o) } }); }
    view(item: UserLocationHistoryEntity) { const o: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/userlocationhistory', prevData: this.itemData }; this.router.navigate(['/admin/userlocationhistory/view'], { state: { params: JSON.stringify(o) } }); }
}
@NgModule({
    declarations: [UserLocationHistoryComponent, EditUserLocationHistoryComponent],
    imports: [UtilityModule, RouterModule.forChild([
        { path: '', component: UserLocationHistoryComponent, pathMatch: 'full', data: { state: 'userlocationhistory' }, canActivate: [AdminAuthGuard] },
        { path: 'add', component: EditUserLocationHistoryComponent, pathMatch: 'full', data: { state: 'add_userlocationhistory' }, canActivate: [AdminAuthGuard] },
        { path: 'edit', component: EditUserLocationHistoryComponent, pathMatch: 'full', data: { state: 'edit_userlocationhistory' }, canActivate: [AdminAuthGuard] },
        { path: 'view', component: EditUserLocationHistoryComponent, pathMatch: 'full', data: { state: 'view_userlocationhistory' }, canActivate: [AdminAuthGuard] },
    ])]
})
export class UserLocationHistoryModule {}
