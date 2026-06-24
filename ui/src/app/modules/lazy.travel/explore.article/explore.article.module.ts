import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { ExploreArticleEntity } from '../../../_app.core/domains/entities/explore.article.entity';
import { EditExploreArticleComponent } from './edit.explore.article/edit.explore.article.component';
@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class ExploreArticleComponent extends GridComponent {
    obj: GridData = { Reference: ExploreArticleEntity, Size: ModalSizeType.Large, Imports: [], Exports: [], Properties: ['Id','Title','ArticleCategory','PlaceId','Author','ViewCount','IsPublished','PublishedDate'], Features: [ActionData.reload(() => this.loadItems())] };
    constructor() { super(); this.render(this.obj); }
    addNew() { const o: NavigationStateData = { prevUrl: '/admin/explorearticle', prevData: this.itemData }; this.router.navigate(['/admin/explorearticle/add'], { state: { params: JSON.stringify(o) } }); }
    edit(item: ExploreArticleEntity) { const o: NavigationStateData = { id: item.Id, prevUrl: '/admin/explorearticle', prevData: this.itemData }; this.router.navigate(['/admin/explorearticle/edit'], { state: { params: JSON.stringify(o) } }); }
    view(item: ExploreArticleEntity) { const o: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/explorearticle', prevData: this.itemData }; this.router.navigate(['/admin/explorearticle/view'], { state: { params: JSON.stringify(o) } }); }
}
@NgModule({
    declarations: [ExploreArticleComponent, EditExploreArticleComponent],
    imports: [UtilityModule, RouterModule.forChild([
        { path: '', component: ExploreArticleComponent, pathMatch: 'full', data: { state: 'explorearticle' }, canActivate: [AdminAuthGuard] },
        { path: 'add', component: EditExploreArticleComponent, pathMatch: 'full', data: { state: 'add_explorearticle' }, canActivate: [AdminAuthGuard] },
        { path: 'edit', component: EditExploreArticleComponent, pathMatch: 'full', data: { state: 'edit_explorearticle' }, canActivate: [AdminAuthGuard] },
        { path: 'view', component: EditExploreArticleComponent, pathMatch: 'full', data: { state: 'view_explorearticle' }, canActivate: [AdminAuthGuard] },
    ])]
})
export class ExploreArticleModule {}
