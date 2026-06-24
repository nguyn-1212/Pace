import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

// modules
import { PipeModule } from '../core/pipes/_pipe.module';
import { ModalModule } from '../core/modal/modal.module';
import { DirectiveModule } from '../core/directives/_directive.module';

// layout
import { LayoutComponent } from './layout.component';
import { EditorModule } from '../core/editor/editor.module';
import { ComponentModule } from '../core/components/component.module';
import { LayoutAsideComponent } from './components/aside/aside.component';
import { LayoutSignInComponent } from './signin/template.signin.component';
import { LayoutHeaderComponent } from './components/header/header.component';
import { LayoutFooterComponent } from './components/footer/footer.component';
import { LayoutSubHeaderComponent } from './components/sub.header/sub.header.component';
import { LayoutScrollTopComponent } from './components/scroll.top/scroll.top.component';
import { LayoutQuickPanelComponent } from './components/quick.panel/quick.panel.component';
import { LayoutHeaderMobileComponent } from './components/header.mobile/header.mobile.component';
import { ChangePasswordComponent } from './components/change.password/change.password.component';

@NgModule({
    imports: [
        PipeModule,
        FormsModule,
        ModalModule,
        CommonModule,
        RouterModule,
        EditorModule,
        BrowserModule,
        ComponentModule,
        DirectiveModule,
    ],
    declarations: [
        LayoutComponent,
        LayoutAsideComponent,
        LayoutHeaderComponent,
        LayoutFooterComponent,
        LayoutSignInComponent,
        ChangePasswordComponent,
        LayoutSubHeaderComponent,
        LayoutScrollTopComponent,
        LayoutQuickPanelComponent,
        LayoutHeaderMobileComponent,
    ],
    exports: [
        LayoutComponent,
        LayoutAsideComponent,
        LayoutHeaderComponent,
        LayoutFooterComponent,
        LayoutSignInComponent,
        LayoutSubHeaderComponent,
        LayoutScrollTopComponent,
        LayoutQuickPanelComponent,
        LayoutHeaderMobileComponent,
    ]
})
export class LayoutModule { }
