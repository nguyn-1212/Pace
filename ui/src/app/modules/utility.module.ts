import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// modules
import { PipeModule } from '../core/pipes/_pipe.module';
import { ModalModule } from '../core/modal/modal.module';
import { EditorModule } from '../core/editor/editor.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ComponentModule } from '../core/components/component.module';
import { DirectiveModule } from '../core/directives/_directive.module';

@NgModule({
    imports: [
        PipeModule,
        ModalModule,
        FormsModule,
        CommonModule,
        RouterModule,
        EditorModule,
        DirectiveModule,
        ComponentModule,
        NgxSkeletonLoaderModule
    ],
    exports: [
        PipeModule,
        ModalModule,
        FormsModule,
        CommonModule,
        RouterModule,
        EditorModule,
        DirectiveModule,
        ComponentModule,
        NgxSkeletonLoaderModule
    ]
})
export class UtilityModule { }
