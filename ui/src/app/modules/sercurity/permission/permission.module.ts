import { RouterModule } from "@angular/router";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../core/domains/data/grid.data";
import { DataType } from "../../../core/domains/enums/data.type";
import { ResultApi } from "../../../core/domains/data/result.api";
import { ToastrHelper } from "../../../core/helpers/toastr.helper";
import { ActionData } from "../../../core/domains/data/action.data";
import { ActionType } from "../../../core/domains/enums/action.type";
import { MethodType } from "../../../core/domains/enums/method.type";
import { AdminAuthGuard } from "../../../_app.core/guards/admin.auth.guard";
import { ModalSizeType } from "../../../core/domains/enums/modal.size.type";
import { GridComponent } from "../../../core/components/grid/grid.component";
import { PermissionAutoDto } from "../../../core/domains/objects/permission.dto";
import { PermissionEntity } from "../../../core/domains/entities/permission.entity";

@Component({
    templateUrl: '../../../core/components/grid/grid.component.html',
})
export class PermissionComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Checkable: true,
        AllowCheckAll: true,
        Size: ModalSizeType.Large,
        Reference: PermissionEntity,
        Features: [
            ActionData.addNew(() => this.addNew()),
            ActionData.reload(() => this.loadItems()),
            ActionData.resetCache(() => this.resetCache()),
            {
                icon: 'la la-plus',
                className: 'btn btn-primary',
                systemName: ActionType.AddNew,
                name: 'Core.ActionType.AddNewAuto',
                click: () => {
                    this.popupAutoAsync({
                        size: ModalSizeType.Medium,
                        confirmText: this.translate.transform('General.AddNew'),
                        title: this.translate.transform('Core.ActionType.AddNewAuto'),
                        objectValue: {
                            reference: PermissionAutoDto,
                        },
                        confirmFunction: async (item: any) => {
                            return await this.service.callApi('permission', 'createPermission', item, MethodType.Post).then(async (result: ResultApi) => {
                                if (ResultApi.IsSuccess(result)) {
                                    ToastrHelper.Success(this.translate.transform('General.AddNewSuccess'));
                                    await this.loadItems();
                                    return true;
                                } else {
                                    ToastrHelper.ErrorResult(result);
                                    return false;
                                }
                            })
                        }
                    })
                }
            }
        ]
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Group', Type: DataType.String },
            { Property: 'Title', Type: DataType.String },
            { Property: 'Name', Type: DataType.String },
            { Property: 'Types', Type: DataType.Boolean },
            { Property: 'Controller', Type: DataType.String },
            { Property: 'Action', Type: DataType.String },
        ];
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [PermissionComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: PermissionComponent, pathMatch: 'full', data: { state: 'permission' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class PermissionModule { }