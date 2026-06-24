import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../core/domains/data/grid.data";
import { AdminAuthGuard } from "../../../_app.core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../core/domains/enums/modal.size.type";
import { GridComponent } from "../../../core/components/grid/grid.component";
import { NavigationStateData } from "../../../core/domains/data/navigation.state";
import { EmailTemplateEntity } from "../../../core/domains/entities/email.template.entity";
import { EditEmailTemplateComponent } from "./edit.email.template/edit.email.template.component";

@Component({
    templateUrl: '../../../core/components/grid/grid.component.html',
})
export class EmailTemplateComponent extends GridComponent {
    obj: GridData = {
        UpdatedBy: false,
        Size: ModalSizeType.FullScreen,
        Reference: EmailTemplateEntity,
        Properties: ['Id', 'Title', 'Type', 'SmtpAccount'],
    };

    constructor() {
        super();
        this.render(this.obj);
    }         

    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/emailtemplate',
        };
        this.router.navigate(['/admin/emailtemplate/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: EmailTemplateEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.itemData,
            prevUrl: '/admin/emailtemplate',
        };
        this.router.navigate(['/admin/emailtemplate/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: EmailTemplateEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/emailtemplate',
        };
        this.router.navigate(['/admin/emailtemplate/view'], { state: { params: JSON.stringify(obj) } });
    }
}

@NgModule({
    declarations: [
        EmailTemplateComponent,
        EditEmailTemplateComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: EmailTemplateComponent, pathMatch: 'full', data: { state: 'emailtemplate'}, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditEmailTemplateComponent, pathMatch: 'full', data: { state: 'add_emailtemplate'}, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditEmailTemplateComponent, pathMatch: 'full', data: { state: 'edit_emailtemplate'}, canActivate: [AdminAuthGuard] },
            { path: 'view', component: EditEmailTemplateComponent, pathMatch: 'full', data: { state: 'view_emailtemplate'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class EmailTemplateModule { }