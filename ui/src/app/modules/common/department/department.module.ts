import { RouterModule } from "@angular/router";
import { ShareModule } from "../../share.module";
import { Component, NgModule } from "@angular/core";
import { UtilityModule } from "../../utility.module";
import { GridData } from "../../../core/domains/data/grid.data";
import { DataType } from "../../../core/domains/enums/data.type";
import { ActionData } from "../../../core/domains/data/action.data";
import { ActionType } from "../../../core/domains/enums/action.type";
import { UtilityExHelper } from "../../../core/helpers/utility.helper";
import { BaseEntity } from "../../../core/domains/entities/base.entity";
import { ModalSizeType } from "../../../core/domains/enums/modal.size.type";
import { AdminAuthGuard } from "../../../_app.core/guards/admin.auth.guard";
import { GridComponent } from "../../../core/components/grid/grid.component";
import { DepartmentEntity } from "../../../core/domains/entities/department.entity";
import { ViewDepartmentComponent } from "./view.department/view.department.component";
import { EditDepartmentComponent } from "./edit.department/edit.department.component";
import { ChoiceUserComponent } from "../../sercurity/user/choice.user/choice.user.component";
import { ViewChoiceUserComponent } from "../../sercurity/user/choice.user/view.choice.user.component";

@Component({
    templateUrl: '../../../core/components/grid/grid.component.html',
})
export class DepartmentComponent extends GridComponent {
    obj: GridData = {
        Filters: [],
        Imports: [],
        Exports: [],
        Navigation: true,
        Size: ModalSizeType.Medium,
        Reference: DepartmentEntity,
        MoreActions: [
            {
                icon: 'la la-users',
                name: ActionType.EditMember,
                systemName: ActionType.EditMember,
                click: ((item: DepartmentEntity) => {
                    this.popupChoiceUser(item);
                })
            },
            ActionData.history((item: DepartmentEntity) => {
                this.viewHistory(item.Id);
            })
        ]
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            {
                Property: 'Name', Type: DataType.String,
                Format: ((item: any) => {
                    item['NameText'] = item['Name'];
                    return '<a routerLink="view">' + UtilityExHelper.escapeHtml(item.Name) + '</a>';
                })
            },
            { Property: 'Code', Type: DataType.String },
            { Property: 'Description', Type: DataType.String },
            {
                Property: 'Amount', Type: DataType.String, Align: 'center',
                Click: ((item: DepartmentEntity) => {
                    this.popupViewChoiceUser(item);
                }),
                Format: ((item: any) => {
                    return item.Amount + ' ' + this.translate.transform('BaseEntity.Employee')
                })
            }
        ];
        this.render(this.obj);
    }

    private popupChoiceUser(item: BaseEntity) {
        this.dialogService.WapperAsync({
            object: ChoiceUserComponent,
            size: ModalSizeType.ExtraLarge,
            cancelText: this.translate.transform('Core.ActionType.Close'),
            title: this.translate.transform('DepartmentEntity.AddNewMember'),
            confirmText: this.translate.transform('DepartmentEntity.ChoiceMember'),
            objectExtra: {
                id: item.Id,
                autoSave: true,
                navigation: true,
                type: this.obj.ReferenceName,
            },
        }, async () => {
            this.loadItems();
        });
    }
    private popupViewChoiceUser(item: BaseEntity) {
        let addUser = this.authen.permissionAllow(this.obj.ReferenceName, ActionType.EditMember),
            deleteUser = this.authen.permissionAllow(this.obj.ReferenceName, ActionType.EditMember);
        this.dialogService.WapperAsync({
            size: ModalSizeType.ExtraLarge,
            object: ViewChoiceUserComponent,
            cancelText: this.translate.transform('Core.ActionType.Close'),
            confirmText: this.translate.transform('Core.ActionType.Save'),
            title: this.translate.transform('DepartmentEntity.ViewMember'),
            objectExtra: {
                id: item.Id,
                autoSave: true,
                type: this.obj.ReferenceName,
                addUser: addUser,
                navigation: true,
                deleteUser: deleteUser,
                choiceComplete: () => {
                    this.loadItems();
                }
            },
        }, async () => {
            this.loadItems();
        });
    }
}

@NgModule({
    declarations: [
        DepartmentComponent,
        ViewDepartmentComponent,
        EditDepartmentComponent
    ],
    imports: [
        ShareModule,
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: DepartmentComponent, pathMatch: 'full', data: { state: 'department' }, canActivate: [AdminAuthGuard] },
            { path: 'add', component: EditDepartmentComponent, pathMatch: 'full', data: { state: 'add_department' }, canActivate: [AdminAuthGuard] },
            { path: 'view', component: ViewDepartmentComponent, pathMatch: 'full', data: { state: 'view_department' }, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditDepartmentComponent, pathMatch: 'full', data: { state: 'edit_department' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class DepartmentModule { }