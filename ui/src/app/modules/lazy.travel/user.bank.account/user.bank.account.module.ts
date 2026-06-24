import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { UserBankAccountEntity } from '../../../_app.core/domains/entities/user.bank.account.entity';
import { EditUserBankAccountComponent } from './edit.user.bank.account/edit.user.bank.account.component';

@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class UserBankAccountComponent extends GridComponent {
    obj: GridData = {
        Reference: UserBankAccountEntity,
        Size: ModalSizeType.Medium,
        Properties: ['Id','UserId','BankName','AccountNumber','AccountName','IsDefault'],
        Imports: [],
        Exports: [],
        Features: [ActionData.reload(() => this.loadItems())],
    };

    constructor() {
        super();
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            title: 'Thêm Tài khoản ngân hàng',
            size: ModalSizeType.Medium,
            cancelText: 'Đóng',
            confirmText: 'Lưu',
            object: EditUserBankAccountComponent,
            objectExtra: { popup: true },
        }, async () => { await this.loadItems(); });
    }

    edit(item: UserBankAccountEntity) {
        this.dialogService.WapperAsync({
            title: 'Chỉnh sửa Tài khoản ngân hàng',
            size: ModalSizeType.Medium,
            cancelText: 'Đóng',
            confirmText: 'Lưu',
            object: EditUserBankAccountComponent,
            objectExtra: { id: item.Id, popup: true },
        }, async () => { await this.loadItems(); });
    }
}

@NgModule({
    declarations: [UserBankAccountComponent, EditUserBankAccountComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: UserBankAccountComponent, pathMatch: 'full', data: { state: 'userbankaccount' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class UserBankAccountModule {}

