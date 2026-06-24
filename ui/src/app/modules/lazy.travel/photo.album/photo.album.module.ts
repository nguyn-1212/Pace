import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { PhotoAlbumEntity } from '../../../_app.core/domains/entities/photo.album.entity';
import { EditPhotoAlbumComponent } from './edit.photo.album/edit.photo.album.component';
@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class PhotoAlbumComponent extends GridComponent {
    obj: GridData = { Reference: PhotoAlbumEntity, Size: ModalSizeType.Large, Imports: [], Exports: [], Properties: ['Id','TripId','Name','CoverUrl','CreatedDate'], Features: [ActionData.reload(() => this.loadItems())] };
    constructor() { super(); this.render(this.obj); }
    addNew() { const o: NavigationStateData = { prevUrl: '/admin/photoalbum', prevData: this.itemData }; this.router.navigate(['/admin/photoalbum/add'], { state: { params: JSON.stringify(o) } }); }
    edit(item: PhotoAlbumEntity) { const o: NavigationStateData = { id: item.Id, prevUrl: '/admin/photoalbum', prevData: this.itemData }; this.router.navigate(['/admin/photoalbum/edit'], { state: { params: JSON.stringify(o) } }); }
    view(item: PhotoAlbumEntity) { const o: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/photoalbum', prevData: this.itemData }; this.router.navigate(['/admin/photoalbum/view'], { state: { params: JSON.stringify(o) } }); }
}
@NgModule({
    declarations: [PhotoAlbumComponent, EditPhotoAlbumComponent],
    imports: [UtilityModule, RouterModule.forChild([
        { path: '', component: PhotoAlbumComponent, pathMatch: 'full', data: { state: 'photoalbum' }, canActivate: [AdminAuthGuard] },
        { path: 'add', component: EditPhotoAlbumComponent, pathMatch: 'full', data: { state: 'add_photoalbum' }, canActivate: [AdminAuthGuard] },
        { path: 'edit', component: EditPhotoAlbumComponent, pathMatch: 'full', data: { state: 'edit_photoalbum' }, canActivate: [AdminAuthGuard] },
        { path: 'view', component: EditPhotoAlbumComponent, pathMatch: 'full', data: { state: 'view_photoalbum' }, canActivate: [AdminAuthGuard] },
    ])]
})
export class PhotoAlbumModule {}
