import { NgModule } from '@angular/core';
import { UtilityModule } from './utility.module';
import { ViewUserComponent } from './sercurity/user/view.user/view.user.component';
import { ChoiceUserComponent } from './sercurity/user/choice.user/choice.user.component';
import { ViewChoiceUserComponent } from './sercurity/user/choice.user/view.choice.user.component';

@NgModule({
    imports: [
        UtilityModule
    ],
    declarations: [
        ViewUserComponent,
        ChoiceUserComponent,
        ViewChoiceUserComponent,
    ],
    exports: [
        ViewUserComponent,
        ChoiceUserComponent,
        ViewChoiceUserComponent,
    ]
})
export class ShareModule { }
