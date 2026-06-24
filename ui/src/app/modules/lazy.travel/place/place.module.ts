import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { PlaceEntity } from '../../../_app.core/domains/entities/place.entity';
import { EditPlaceComponent } from './edit.place/edit.place.component';

@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class PlaceComponent extends GridComponent {
    obj: GridData = {
        Reference: PlaceEntity,
        Size: ModalSizeType.Large,
        Imports: [], Exports: [],
        Properties: ['Id','Name','NameEn','Type','Country','Province','City','Rating','IsVerified'],
        Features: [ActionData.reload(() => this.loadItems())],
    };
    constructor() { super(); this.render(this.obj); }
    addNew() {
        const obj: NavigationStateData = { prevUrl: '/admin/place', prevData: this.itemData };
        this.router.navigate(['/admin/place/add'], { state: { params: JSON.stringify(obj) } });
    }
    edit(item: PlaceEntity) {
        const obj: NavigationStateData = { id: item.Id, prevUrl: '/admin/place', prevData: this.itemData };
        this.router.navigate(['/admin/place/edit'], { state: { params: JSON.stringify(obj) } });
    }
    view(item: PlaceEntity) {
        const obj: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/place', prevData: this.itemData };
        this.router.navigate(['/admin/place/view'], { state: { params: JSON.stringify(obj) } });
    }
}
@NgModule({
    declarations: [PlaceComponent, EditPlaceComponent],
    imports: [UtilityModule, RouterModule.forChild([
        { path: '', component: PlaceComponent, pathMatch: 'full', data: { state: 'place' }, canActivate: [AdminAuthGuard] },
        { path: 'add', component: EditPlaceComponent, pathMatch: 'full', data: { state: 'add_place' }, canActivate: [AdminAuthGuard] },
        { path: 'edit', component: EditPlaceComponent, pathMatch: 'full', data: { state: 'edit_place' }, canActivate: [AdminAuthGuard] },
        { path: 'view', component: EditPlaceComponent, pathMatch: 'full', data: { state: 'view_place' }, canActivate: [AdminAuthGuard] },
    ])]
})
export class PlaceModule {}
