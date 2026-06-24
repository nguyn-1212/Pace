import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { TimelineEntryEntity } from '../../../_app.core/domains/entities/timeline.entry.entity';
import { EditTimelineEntryComponent } from './edit.timeline.entry/edit.timeline.entry.component';
@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class TimelineEntryComponent extends GridComponent {
    obj: GridData = { Reference: TimelineEntryEntity, Size: ModalSizeType.Large, Imports: [], Exports: [], Properties: ['Id','TripId','EntryType','RefId','UserId','CreatedDate'], Features: [ActionData.reload(() => this.loadItems())] };
    constructor() { super(); this.render(this.obj); }
    addNew() { const o: NavigationStateData = { prevUrl: '/admin/timelineentry', prevData: this.itemData }; this.router.navigate(['/admin/timelineentry/add'], { state: { params: JSON.stringify(o) } }); }
    edit(item: TimelineEntryEntity) { const o: NavigationStateData = { id: item.Id, prevUrl: '/admin/timelineentry', prevData: this.itemData }; this.router.navigate(['/admin/timelineentry/edit'], { state: { params: JSON.stringify(o) } }); }
    view(item: TimelineEntryEntity) { const o: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/timelineentry', prevData: this.itemData }; this.router.navigate(['/admin/timelineentry/view'], { state: { params: JSON.stringify(o) } }); }
}
@NgModule({
    declarations: [TimelineEntryComponent, EditTimelineEntryComponent],
    imports: [UtilityModule, RouterModule.forChild([
        { path: '', component: TimelineEntryComponent, pathMatch: 'full', data: { state: 'timelineentry' }, canActivate: [AdminAuthGuard] },
        { path: 'add', component: EditTimelineEntryComponent, pathMatch: 'full', data: { state: 'add_timelineentry' }, canActivate: [AdminAuthGuard] },
        { path: 'edit', component: EditTimelineEntryComponent, pathMatch: 'full', data: { state: 'edit_timelineentry' }, canActivate: [AdminAuthGuard] },
        { path: 'view', component: EditTimelineEntryComponent, pathMatch: 'full', data: { state: 'view_timelineentry' }, canActivate: [AdminAuthGuard] },
    ])]
})
export class TimelineEntryModule {}
