import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { TripEntity } from '../../../_app.core/domains/entities/trip.entity';
import { EditTripComponent } from './edit.trip/edit.trip.component';

@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class TripComponent extends GridComponent {
    obj: GridData = {
        Reference: TripEntity,
        Size: ModalSizeType.Large,
        Imports: [],
        Exports: [],
        Properties: ['Id','Code','Name','Status','OwnerId','StartDate','EndDate','Currency','IsPublic'],
        Features: [ActionData.reload(() => this.loadItems())],
    };

    constructor() {
        super();
        this.render(this.obj);
    }

    addNew() {
        const obj: NavigationStateData = { prevUrl: '/admin/trip', prevData: this.itemData };
        this.router.navigate(['/admin/trip/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: TripEntity) {
        const obj: NavigationStateData = { id: item.Id, prevUrl: '/admin/trip', prevData: this.itemData };
        this.router.navigate(['/admin/trip/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: TripEntity) {
        const obj: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/trip', prevData: this.itemData };
        this.router.navigate(['/admin/trip/view'], { state: { params: JSON.stringify(obj) } });
    }
}

@NgModule({
    declarations: [TripComponent, EditTripComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: TripComponent, pathMatch: 'full', data: { state: 'trip' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditTripComponent, pathMatch: 'full', data: { state: 'add_trip' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditTripComponent, pathMatch: 'full', data: { state: 'edit_trip' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: EditTripComponent, pathMatch: 'full', data: { state: 'view_trip' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class TripModule {}
