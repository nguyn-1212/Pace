import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { TripMemberEntity } from '../../../_app.core/domains/entities/trip.member.entity';
import { EditTripMemberComponent } from './edit.trip.member/edit.trip.member.component';

@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class TripMemberComponent extends GridComponent {
    obj: GridData = {
        Reference: TripMemberEntity,
        Size: ModalSizeType.Large,
        Imports: [],
        Exports: [],
        Properties: ['Id','TripId','UserId','Role','Status','JoinedDate'],
        Features: [ActionData.reload(() => this.loadItems())],
    };

    constructor() {
        super();
        this.render(this.obj);
    }

    addNew() {
        const obj: NavigationStateData = { prevUrl: '/admin/tripmember', prevData: this.itemData };
        this.router.navigate(['/admin/tripmember/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: TripMemberEntity) {
        const obj: NavigationStateData = { id: item.Id, prevUrl: '/admin/tripmember', prevData: this.itemData };
        this.router.navigate(['/admin/tripmember/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: TripMemberEntity) {
        const obj: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/tripmember', prevData: this.itemData };
        this.router.navigate(['/admin/tripmember/view'], { state: { params: JSON.stringify(obj) } });
    }
}

@NgModule({
    declarations: [TripMemberComponent, EditTripMemberComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: TripMemberComponent, pathMatch: 'full', data: { state: 'tripmember' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditTripMemberComponent, pathMatch: 'full', data: { state: 'add_tripmember' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditTripMemberComponent, pathMatch: 'full', data: { state: 'edit_tripmember' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: EditTripMemberComponent, pathMatch: 'full', data: { state: 'view_tripmember' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class TripMemberModule {}
