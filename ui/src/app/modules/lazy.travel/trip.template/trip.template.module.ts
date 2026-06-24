import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { TripTemplateEntity } from '../../../_app.core/domains/entities/trip.template.entity';
import { EditTripTemplateComponent } from './edit.trip.template/edit.trip.template.component';
@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class TripTemplateComponent extends GridComponent {
    obj: GridData = { Reference: TripTemplateEntity, Size: ModalSizeType.Large, Imports: [], Exports: [], Properties: ['Id','Name','Destination','Duration','EstCostPerPerson','Currency','UsedCount','IsOfficial'], Features: [ActionData.reload(() => this.loadItems())] };
    constructor() { super(); this.render(this.obj); }
    addNew() { const o: NavigationStateData = { prevUrl: '/admin/triptemplate', prevData: this.itemData }; this.router.navigate(['/admin/triptemplate/add'], { state: { params: JSON.stringify(o) } }); }
    edit(item: TripTemplateEntity) { const o: NavigationStateData = { id: item.Id, prevUrl: '/admin/triptemplate', prevData: this.itemData }; this.router.navigate(['/admin/triptemplate/edit'], { state: { params: JSON.stringify(o) } }); }
    view(item: TripTemplateEntity) { const o: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/triptemplate', prevData: this.itemData }; this.router.navigate(['/admin/triptemplate/view'], { state: { params: JSON.stringify(o) } }); }
}
@NgModule({
    declarations: [TripTemplateComponent, EditTripTemplateComponent],
    imports: [UtilityModule, RouterModule.forChild([
        { path: '', component: TripTemplateComponent, pathMatch: 'full', data: { state: 'triptemplate' }, canActivate: [AdminAuthGuard] },
        { path: 'add', component: EditTripTemplateComponent, pathMatch: 'full', data: { state: 'add_triptemplate' }, canActivate: [AdminAuthGuard] },
        { path: 'edit', component: EditTripTemplateComponent, pathMatch: 'full', data: { state: 'edit_triptemplate' }, canActivate: [AdminAuthGuard] },
        { path: 'view', component: EditTripTemplateComponent, pathMatch: 'full', data: { state: 'view_triptemplate' }, canActivate: [AdminAuthGuard] },
    ])]
})
export class TripTemplateModule {}
