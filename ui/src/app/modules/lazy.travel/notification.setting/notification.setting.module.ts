import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { NotificationSettingEntity } from '../../../_app.core/domains/entities/notification.setting.entity';
import { EditNotificationSettingComponent } from './edit.notification.setting/edit.notification.setting.component';
@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class NotificationSettingComponent extends GridComponent {
    obj: GridData = { Reference: NotificationSettingEntity, Size: ModalSizeType.Large, Imports: [], Exports: [], Properties: ['Id','UserId','NotifyType','IsEnabled','Channel'], Features: [ActionData.reload(() => this.loadItems())] };
    constructor() { super(); this.render(this.obj); }
    addNew() { const o: NavigationStateData = { prevUrl: '/admin/notificationsetting', prevData: this.itemData }; this.router.navigate(['/admin/notificationsetting/add'], { state: { params: JSON.stringify(o) } }); }
    edit(item: NotificationSettingEntity) { const o: NavigationStateData = { id: item.Id, prevUrl: '/admin/notificationsetting', prevData: this.itemData }; this.router.navigate(['/admin/notificationsetting/edit'], { state: { params: JSON.stringify(o) } }); }
    view(item: NotificationSettingEntity) { const o: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/notificationsetting', prevData: this.itemData }; this.router.navigate(['/admin/notificationsetting/view'], { state: { params: JSON.stringify(o) } }); }
}
@NgModule({
    declarations: [NotificationSettingComponent, EditNotificationSettingComponent],
    imports: [UtilityModule, RouterModule.forChild([
        { path: '', component: NotificationSettingComponent, pathMatch: 'full', data: { state: 'notificationsetting' }, canActivate: [AdminAuthGuard] },
        { path: 'add', component: EditNotificationSettingComponent, pathMatch: 'full', data: { state: 'add_notificationsetting' }, canActivate: [AdminAuthGuard] },
        { path: 'edit', component: EditNotificationSettingComponent, pathMatch: 'full', data: { state: 'edit_notificationsetting' }, canActivate: [AdminAuthGuard] },
        { path: 'view', component: EditNotificationSettingComponent, pathMatch: 'full', data: { state: 'view_notificationsetting' }, canActivate: [AdminAuthGuard] },
    ])]
})
export class NotificationSettingModule {}
