import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { UserActivityStatEntity } from '../../../_app.core/domains/entities/user.activity.stat.entity';
import { EditUserActivityStatComponent } from './edit.user.activity.stat/edit.user.activity.stat.component';
@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class UserActivityStatComponent extends GridComponent {
    obj: GridData = { Reference: UserActivityStatEntity, Size: ModalSizeType.Large, Imports: [], Exports: [], Properties: ['Id','UserId','TotalTrips','TotalFriends','TotalCheckins','TotalPhotos','TotalKm','TotalCountries','TotalProvinces'], Features: [ActionData.reload(() => this.loadItems())] };
    constructor() { super(); this.render(this.obj); }
    addNew() { const o: NavigationStateData = { prevUrl: '/admin/useractivitystat', prevData: this.itemData }; this.router.navigate(['/admin/useractivitystat/add'], { state: { params: JSON.stringify(o) } }); }
    edit(item: UserActivityStatEntity) { const o: NavigationStateData = { id: item.Id, prevUrl: '/admin/useractivitystat', prevData: this.itemData }; this.router.navigate(['/admin/useractivitystat/edit'], { state: { params: JSON.stringify(o) } }); }
    view(item: UserActivityStatEntity) { const o: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/useractivitystat', prevData: this.itemData }; this.router.navigate(['/admin/useractivitystat/view'], { state: { params: JSON.stringify(o) } }); }
}
@NgModule({
    declarations: [UserActivityStatComponent, EditUserActivityStatComponent],
    imports: [UtilityModule, RouterModule.forChild([
        { path: '', component: UserActivityStatComponent, pathMatch: 'full', data: { state: 'useractivitystat' }, canActivate: [AdminAuthGuard] },
        { path: 'add', component: EditUserActivityStatComponent, pathMatch: 'full', data: { state: 'add_useractivitystat' }, canActivate: [AdminAuthGuard] },
        { path: 'edit', component: EditUserActivityStatComponent, pathMatch: 'full', data: { state: 'edit_useractivitystat' }, canActivate: [AdminAuthGuard] },
        { path: 'view', component: EditUserActivityStatComponent, pathMatch: 'full', data: { state: 'view_useractivitystat' }, canActivate: [AdminAuthGuard] },
    ])]
})
export class UserActivityStatModule {}
