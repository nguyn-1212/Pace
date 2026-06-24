import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { UserPrivacySettingEntity } from '../../../_app.core/domains/entities/user.privacy.setting.entity';
import { EditUserPrivacySettingComponent } from './edit.user.privacy.setting/edit.user.privacy.setting.component';
@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class UserPrivacySettingComponent extends GridComponent {
    obj: GridData = { Reference: UserPrivacySettingEntity, Size: ModalSizeType.Large, Imports: [], Exports: [], Properties: ['Id','UserId','ShareLocation','ShowOnlineStatus','WhoCanFind','ShowTripHistory'], Features: [ActionData.reload(() => this.loadItems())] };
    constructor() { super(); this.render(this.obj); }
    addNew() { const o: NavigationStateData = { prevUrl: '/admin/userprivacysetting', prevData: this.itemData }; this.router.navigate(['/admin/userprivacysetting/add'], { state: { params: JSON.stringify(o) } }); }
    edit(item: UserPrivacySettingEntity) { const o: NavigationStateData = { id: item.Id, prevUrl: '/admin/userprivacysetting', prevData: this.itemData }; this.router.navigate(['/admin/userprivacysetting/edit'], { state: { params: JSON.stringify(o) } }); }
    view(item: UserPrivacySettingEntity) { const o: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/userprivacysetting', prevData: this.itemData }; this.router.navigate(['/admin/userprivacysetting/view'], { state: { params: JSON.stringify(o) } }); }
}
@NgModule({
    declarations: [UserPrivacySettingComponent, EditUserPrivacySettingComponent],
    imports: [UtilityModule, RouterModule.forChild([
        { path: '', component: UserPrivacySettingComponent, pathMatch: 'full', data: { state: 'userprivacysetting' }, canActivate: [AdminAuthGuard] },
        { path: 'add', component: EditUserPrivacySettingComponent, pathMatch: 'full', data: { state: 'add_userprivacysetting' }, canActivate: [AdminAuthGuard] },
        { path: 'edit', component: EditUserPrivacySettingComponent, pathMatch: 'full', data: { state: 'edit_userprivacysetting' }, canActivate: [AdminAuthGuard] },
        { path: 'view', component: EditUserPrivacySettingComponent, pathMatch: 'full', data: { state: 'view_userprivacysetting' }, canActivate: [AdminAuthGuard] },
    ])]
})
export class UserPrivacySettingModule {}
