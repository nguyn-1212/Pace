import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { DataType } from '../../../core/domains/enums/data.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { SmtpAccountEntity } from '../../../core/domains/entities/smtp.account.entity';

@Component({
    templateUrl: '../../../core/components/grid/grid.component.html',
})
export class SmtpAccountComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        Filters: [],
        UpdatedBy: false,
        Size: ModalSizeType.Medium,
        Reference: SmtpAccountEntity,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id' },
            {
                Property: 'User',
                Format: ((item: any) => {
                    let text = '';
                    if (item.User) text += '<p>' + item.User + '</p>';
                    if (item.EmailFrom) text += '<p>Email: ' + item.EmailFrom + '</p>';
                    return text;
                })
            },
            { Property: 'Host' },
            { Property: 'Port', Type: DataType.Number, Align: 'right' },
            { Property: 'EnableSsl', Type: DataType.Boolean, Align: 'center' }            
        ];
        this.render(this.obj);
    }
}

@NgModule({
    declarations: [SmtpAccountComponent],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: SmtpAccountComponent, pathMatch: 'full', data: { state: 'smtpaccount' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class SmtpAccountModule { }