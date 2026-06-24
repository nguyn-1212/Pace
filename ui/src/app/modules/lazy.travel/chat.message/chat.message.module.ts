import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { ChatMessageEntity } from '../../../_app.core/domains/entities/chat.message.entity';
import { EditChatMessageComponent } from './edit.chat.message/edit.chat.message.component';
@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class ChatMessageComponent extends GridComponent {
    obj: GridData = { Reference: ChatMessageEntity, Size: ModalSizeType.Large, Imports: [], Exports: [], Properties: ['Id','TripId','SenderId','Type','Content','IsEdited','CreatedDate'], Features: [ActionData.reload(() => this.loadItems())] };
    constructor() { super(); this.render(this.obj); }
    addNew() { const o: NavigationStateData = { prevUrl: '/admin/chatmessage', prevData: this.itemData }; this.router.navigate(['/admin/chatmessage/add'], { state: { params: JSON.stringify(o) } }); }
    edit(item: ChatMessageEntity) { const o: NavigationStateData = { id: item.Id, prevUrl: '/admin/chatmessage', prevData: this.itemData }; this.router.navigate(['/admin/chatmessage/edit'], { state: { params: JSON.stringify(o) } }); }
    view(item: ChatMessageEntity) { const o: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/chatmessage', prevData: this.itemData }; this.router.navigate(['/admin/chatmessage/view'], { state: { params: JSON.stringify(o) } }); }
}
@NgModule({
    declarations: [ChatMessageComponent, EditChatMessageComponent],
    imports: [UtilityModule, RouterModule.forChild([
        { path: '', component: ChatMessageComponent, pathMatch: 'full', data: { state: 'chatmessage' }, canActivate: [AdminAuthGuard] },
        { path: 'add', component: EditChatMessageComponent, pathMatch: 'full', data: { state: 'add_chatmessage' }, canActivate: [AdminAuthGuard] },
        { path: 'edit', component: EditChatMessageComponent, pathMatch: 'full', data: { state: 'edit_chatmessage' }, canActivate: [AdminAuthGuard] },
        { path: 'view', component: EditChatMessageComponent, pathMatch: 'full', data: { state: 'view_chatmessage' }, canActivate: [AdminAuthGuard] },
    ])]
})
export class ChatMessageModule {}
