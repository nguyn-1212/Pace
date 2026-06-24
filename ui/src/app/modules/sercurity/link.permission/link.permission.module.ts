import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../core/domains/data/grid.data";
import { ActionData } from "../../../core/domains/data/action.data";
import { AdminAuthGuard } from "../../../_app.core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../core/domains/enums/modal.size.type";
import { GridComponent } from "../../../core/components/grid/grid.component";
import { LinkPermissionEntity } from "../../../core/domains/entities/link.permission.entity";

@Component({
    templateUrl: '../../../core/components/grid/grid.component.html',
})
export class LinkPermissionComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Checkable: true,
        Size: ModalSizeType.Large,
        Reference: LinkPermissionEntity,
        LanguageProperties: ['Name', 'Group'],
        Features: [
            ActionData.addNew(() => this.addNew()),
            ActionData.reload(() => this.loadItems()),
            ActionData.resetCache(() => this.resetCache()),
        ],
        Properties: ['Id', 'Name', 'Link', 'Group', 'CssIcon', 'Order', 'Parent', 'Permission', 'GroupOrder'],
    };

    constructor() {
        super();
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [LinkPermissionComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: LinkPermissionComponent, pathMatch: 'full', data: { state: 'link_permission' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class LinkPermissionModule { }