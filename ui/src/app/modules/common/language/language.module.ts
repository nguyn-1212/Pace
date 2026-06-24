import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../core/domains/data/grid.data";
import { AdminAuthGuard } from "../../../_app.core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../core/domains/enums/modal.size.type";
import { GridComponent } from "../../../core/components/grid/grid.component";
import { LanguageEntity } from "../../../core/domains/entities/language.entity";

@Component({
    templateUrl: '../../../core/components/grid/grid.component.html',
})
export class LanguageComponent extends GridComponent {
    obj: GridData = {
        Reference: LanguageEntity,
        Size: ModalSizeType.Large,
    };

    constructor() {
        super();
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [LanguageComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: LanguageComponent, pathMatch: 'full', data: { state: 'language'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class LanguageModule { }