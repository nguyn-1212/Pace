import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { TripActivityEntity } from '../../../_app.core/domains/entities/trip.activity.entity';
import { EditTripActivityComponent } from './edit.trip.activity/edit.trip.activity.component';

@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class TripActivityComponent extends GridComponent {
    obj: GridData = {
        Reference: TripActivityEntity,
        Size: ModalSizeType.Large,
        Imports: [],
        Exports: [],
        Properties: ['Id','TripId','TripDayId','Title','Type','ActivityStatus','StartTime','EstCost'],
        Features: [ActionData.reload(() => this.loadItems())],
    };

    constructor() {
        super();
        this.render(this.obj);
    }

    addNew() {
        const obj: NavigationStateData = { prevUrl: '/admin/tripactivity', prevData: this.itemData };
        this.router.navigate(['/admin/tripactivity/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: TripActivityEntity) {
        const obj: NavigationStateData = { id: item.Id, prevUrl: '/admin/tripactivity', prevData: this.itemData };
        this.router.navigate(['/admin/tripactivity/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: TripActivityEntity) {
        const obj: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/tripactivity', prevData: this.itemData };
        this.router.navigate(['/admin/tripactivity/view'], { state: { params: JSON.stringify(obj) } });
    }
}

@NgModule({
    declarations: [TripActivityComponent, EditTripActivityComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: TripActivityComponent, pathMatch: 'full', data: { state: 'tripactivity' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditTripActivityComponent, pathMatch: 'full', data: { state: 'add_tripactivity' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditTripActivityComponent, pathMatch: 'full', data: { state: 'edit_tripactivity' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: EditTripActivityComponent, pathMatch: 'full', data: { state: 'view_tripactivity' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class TripActivityModule {}
