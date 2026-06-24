import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { TripDayEntity } from '../../../_app.core/domains/entities/trip.day.entity';
import { EditTripDayComponent } from './edit.trip.day/edit.trip.day.component';

@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class TripDayComponent extends GridComponent {
    obj: GridData = {
        Reference: TripDayEntity,
        Size: ModalSizeType.Large,
        Imports: [],
        Exports: [],
        Properties: ['Id','TripId','DayNumber','Date','Title'],
        Features: [ActionData.reload(() => this.loadItems())],
    };

    constructor() {
        super();
        this.render(this.obj);
    }

    addNew() {
        const obj: NavigationStateData = { prevUrl: '/admin/tripday', prevData: this.itemData };
        this.router.navigate(['/admin/tripday/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: TripDayEntity) {
        const obj: NavigationStateData = { id: item.Id, prevUrl: '/admin/tripday', prevData: this.itemData };
        this.router.navigate(['/admin/tripday/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: TripDayEntity) {
        const obj: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/tripday', prevData: this.itemData };
        this.router.navigate(['/admin/tripday/view'], { state: { params: JSON.stringify(obj) } });
    }
}

@NgModule({
    declarations: [TripDayComponent, EditTripDayComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: TripDayComponent, pathMatch: 'full', data: { state: 'tripday' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditTripDayComponent, pathMatch: 'full', data: { state: 'add_tripday' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditTripDayComponent, pathMatch: 'full', data: { state: 'edit_tripday' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: EditTripDayComponent, pathMatch: 'full', data: { state: 'view_tripday' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class TripDayModule {}
