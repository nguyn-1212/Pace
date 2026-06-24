import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { TripTemplateActivityEntity } from '../../../_app.core/domains/entities/trip.template.activity.entity';
import { EditTripTemplateActivityComponent } from './edit.trip.template.activity/edit.trip.template.activity.component';
@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class TripTemplateActivityComponent extends GridComponent {
    obj: GridData = { Reference: TripTemplateActivityEntity, Size: ModalSizeType.Large, Imports: [], Exports: [], Properties: ['Id','TemplateId','DayNumber','StartTime','Title','Type','PlaceId','EstCost','OrderIndex'], Features: [ActionData.reload(() => this.loadItems())] };
    constructor() { super(); this.render(this.obj); }
    addNew() { const o: NavigationStateData = { prevUrl: '/admin/triptemplateactivity', prevData: this.itemData }; this.router.navigate(['/admin/triptemplateactivity/add'], { state: { params: JSON.stringify(o) } }); }
    edit(item: TripTemplateActivityEntity) { const o: NavigationStateData = { id: item.Id, prevUrl: '/admin/triptemplateactivity', prevData: this.itemData }; this.router.navigate(['/admin/triptemplateactivity/edit'], { state: { params: JSON.stringify(o) } }); }
    view(item: TripTemplateActivityEntity) { const o: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/triptemplateactivity', prevData: this.itemData }; this.router.navigate(['/admin/triptemplateactivity/view'], { state: { params: JSON.stringify(o) } }); }
}
@NgModule({
    declarations: [TripTemplateActivityComponent, EditTripTemplateActivityComponent],
    imports: [UtilityModule, RouterModule.forChild([
        { path: '', component: TripTemplateActivityComponent, pathMatch: 'full', data: { state: 'triptemplateactivity' }, canActivate: [AdminAuthGuard] },
        { path: 'add', component: EditTripTemplateActivityComponent, pathMatch: 'full', data: { state: 'add_triptemplateactivity' }, canActivate: [AdminAuthGuard] },
        { path: 'edit', component: EditTripTemplateActivityComponent, pathMatch: 'full', data: { state: 'edit_triptemplateactivity' }, canActivate: [AdminAuthGuard] },
        { path: 'view', component: EditTripTemplateActivityComponent, pathMatch: 'full', data: { state: 'view_triptemplateactivity' }, canActivate: [AdminAuthGuard] },
    ])]
})
export class TripTemplateActivityModule {}
