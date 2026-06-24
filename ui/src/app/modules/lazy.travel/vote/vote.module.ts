import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { VoteEntity } from '../../../_app.core/domains/entities/vote.entity';
import { EditVoteComponent } from './edit.vote/edit.vote.component';
@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class VoteComponent extends GridComponent {
    obj: GridData = { Reference: VoteEntity, Size: ModalSizeType.Large, Imports: [], Exports: [], Properties: ['Id','TripId','Title','Type','VoteStatus','IsAnonymous','DeadLine'], Features: [ActionData.reload(() => this.loadItems())] };
    constructor() { super(); this.render(this.obj); }
    addNew() { const o: NavigationStateData = { prevUrl: '/admin/vote', prevData: this.itemData }; this.router.navigate(['/admin/vote/add'], { state: { params: JSON.stringify(o) } }); }
    edit(item: VoteEntity) { const o: NavigationStateData = { id: item.Id, prevUrl: '/admin/vote', prevData: this.itemData }; this.router.navigate(['/admin/vote/edit'], { state: { params: JSON.stringify(o) } }); }
    view(item: VoteEntity) { const o: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/vote', prevData: this.itemData }; this.router.navigate(['/admin/vote/view'], { state: { params: JSON.stringify(o) } }); }
}
@NgModule({
    declarations: [VoteComponent, EditVoteComponent],
    imports: [UtilityModule, RouterModule.forChild([
        { path: '', component: VoteComponent, pathMatch: 'full', data: { state: 'vote' }, canActivate: [AdminAuthGuard] },
        { path: 'add', component: EditVoteComponent, pathMatch: 'full', data: { state: 'add_vote' }, canActivate: [AdminAuthGuard] },
        { path: 'edit', component: EditVoteComponent, pathMatch: 'full', data: { state: 'edit_vote' }, canActivate: [AdminAuthGuard] },
        { path: 'view', component: EditVoteComponent, pathMatch: 'full', data: { state: 'view_vote' }, canActivate: [AdminAuthGuard] },
    ])]
})
export class VoteModule {}
