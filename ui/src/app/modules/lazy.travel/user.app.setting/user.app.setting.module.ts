import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { UserAppSettingEntity } from '../../../_app.core/domains/entities/user.app.setting.entity';
import { EditUserAppSettingComponent } from './edit.user.app.setting/edit.user.app.setting.component';
@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class UserAppSettingComponent extends GridComponent {
    obj: GridData = { Reference: UserAppSettingEntity, Size: ModalSizeType.Large, Imports: [], Exports: [], Properties: ['Id','UserId','Theme','Language','Currency'], Features: [ActionData.reload(() => this.loadItems())] };
    constructor() { super(); this.render(this.obj); }
    addNew() { const o: NavigationStateData = { prevUrl: '/admin/userappsetting', prevData: this.itemData }; this.router.navigate(['/admin/userappsetting/add'], { state: { params: JSON.stringify(o) } }); }
    edit(item: UserAppSettingEntity) { const o: NavigationStateData = { id: item.Id, prevUrl: '/admin/userappsetting', prevData: this.itemData }; this.router.navigate(['/admin/userappsetting/edit'], { state: { params: JSON.stringify(o) } }); }
    view(item: UserAppSettingEntity) { const o: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/userappsetting', prevData: this.itemData }; this.router.navigate(['/admin/userappsetting/view'], { state: { params: JSON.stringify(o) } }); }
}
@NgModule({
    declarations: [UserAppSettingComponent, EditUserAppSettingComponent],
    imports: [UtilityModule, RouterModule.forChild([
        { path: '', component: UserAppSettingComponent, pathMatch: 'full', data: { state: 'userappsetting' }, canActivate: [AdminAuthGuard] },
        { path: 'add', component: EditUserAppSettingComponent, pathMatch: 'full', data: { state: 'add_userappsetting' }, canActivate: [AdminAuthGuard] },
        { path: 'edit', component: EditUserAppSettingComponent, pathMatch: 'full', data: { state: 'edit_userappsetting' }, canActivate: [AdminAuthGuard] },
        { path: 'view', component: EditUserAppSettingComponent, pathMatch: 'full', data: { state: 'view_userappsetting' }, canActivate: [AdminAuthGuard] },
    ])]
})
export class UserAppSettingModule {}
