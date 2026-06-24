import * as _ from "lodash";
import { UtilityModule } from "../utility.module";
import { Component, NgModule, OnInit } from "@angular/core";
import { GridData } from "../../core/domains/data/grid.data";
import { FormType } from "../../core/domains/enums/form.type";
import { RouterModule, ActivatedRoute } from "@angular/router";
import { OptionHelper } from "../../_app.core/helpers/option.helper";
import { DecoratorHelper } from "../../core/helpers/decorator.helper";
import { AdminAuthGuard } from "../../_app.core/guards/admin.auth.guard";
import { ModalSizeType } from "../../core/domains/enums/modal.size.type";
import { GridComponent } from "../../core/components/grid/grid.component";
import { CategoryType } from "../../_app.core/domains/enums/category.type";
import { CategoryEntity } from "../../_app.core/domains/entities/category.entity";

@Component({
    templateUrl: '../../core/components/grid/grid.component.html',
})
export class AllCategoryComponent extends GridComponent implements OnInit {
    objMappding: GridData[] = [
        {
            Reference: CategoryEntity,
            Forms: [{
                Type: FormType.AddOrEdit,
                Validations: ['Name', 'Type'],
                Properties: [{ property: 'Type', readonly: true }, 'Name', 'Description']
            }],
            Properties: ['Id', 'Name', 'Description'],
        }
    ];

    constructor(private route: ActivatedRoute) {
        super();
        let name = location.pathname
            .replace('allcategory/', '')
            .replace('admin/', '')
            .replace('/', '');
        if (this.objMappding) {
            this.objMappding.forEach((obj: GridData) => {
                if (!obj.Exports) obj.Exports = [];
                if (!obj.Imports) obj.Imports = [];
                if (!obj.Filters) obj.Filters = [];
                if (!obj.Size) obj.Size = ModalSizeType.Medium;
                if (!obj.ReferenceName) {
                    let table = DecoratorHelper.decoratorClass(obj.Reference);
                    obj.ReferenceName = table.name.toLowerCase();
                }
            });
        }
        this.obj = this.objMappding.find(c => c.ReferenceName.toLowerCase() == name);
    }

    ngOnInit(): void {
        this.initPage();
        this.route.queryParams.subscribe(() => {
            this.initPage();
        });
    }

    private initPage() {
        if (this.obj) {
            if (this.obj.ReferenceName == 'category') {
                let type = <CategoryType>(parseInt(this.getParam('type')));
                let option = OptionHelper.CategoryTypes.find(c => c.value == type);
                this.obj.Title = option ? option.label : "Danh mục";
                this.obj.Url = '/admin/category/items/' + type;                
            }
            let foreignKeyId = this.params && this.params['foreignKeyId'];
            if (foreignKeyId) {
                this.renderByForeign(foreignKeyId, this.obj);
            } else this.render(this.obj);
        }
    }
}

@NgModule({
    declarations: [AllCategoryComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: 'category', component: AllCategoryComponent, pathMatch: 'full', data: { state: 'category' }, canActivate: [AdminAuthGuard] },
        ]),
    ]
})
export class AllCategoryModule { }