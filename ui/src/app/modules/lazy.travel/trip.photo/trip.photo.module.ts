import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { TripPhotoEntity } from '../../../_app.core/domains/entities/trip.photo.entity';
import { EditTripPhotoComponent } from './edit.trip.photo/edit.trip.photo.component';
@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class TripPhotoComponent extends GridComponent {
    obj: GridData = { Reference: TripPhotoEntity, Size: ModalSizeType.Large, Imports: [], Exports: [], Properties: ['Id','TripId','AlbumId','UploadedBy','Caption','TakenAt','LikeCount'], Features: [ActionData.reload(() => this.loadItems())] };
    constructor() { super(); this.render(this.obj); }
    addNew() { const o: NavigationStateData = { prevUrl: '/admin/tripphoto', prevData: this.itemData }; this.router.navigate(['/admin/tripphoto/add'], { state: { params: JSON.stringify(o) } }); }
    edit(item: TripPhotoEntity) { const o: NavigationStateData = { id: item.Id, prevUrl: '/admin/tripphoto', prevData: this.itemData }; this.router.navigate(['/admin/tripphoto/edit'], { state: { params: JSON.stringify(o) } }); }
    view(item: TripPhotoEntity) { const o: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/tripphoto', prevData: this.itemData }; this.router.navigate(['/admin/tripphoto/view'], { state: { params: JSON.stringify(o) } }); }
}
@NgModule({
    declarations: [TripPhotoComponent, EditTripPhotoComponent],
    imports: [UtilityModule, RouterModule.forChild([
        { path: '', component: TripPhotoComponent, pathMatch: 'full', data: { state: 'tripphoto' }, canActivate: [AdminAuthGuard] },
        { path: 'add', component: EditTripPhotoComponent, pathMatch: 'full', data: { state: 'add_tripphoto' }, canActivate: [AdminAuthGuard] },
        { path: 'edit', component: EditTripPhotoComponent, pathMatch: 'full', data: { state: 'edit_tripphoto' }, canActivate: [AdminAuthGuard] },
        { path: 'view', component: EditTripPhotoComponent, pathMatch: 'full', data: { state: 'view_tripphoto' }, canActivate: [AdminAuthGuard] },
    ])]
})
export class TripPhotoModule {}
