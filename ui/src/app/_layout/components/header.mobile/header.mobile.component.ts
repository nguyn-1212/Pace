declare var $: any
import { Component } from '@angular/core';
import { AppConfig } from '../../../core/helpers/app.config';
import { AdminDataService } from '../../../core/services/admin.data.service';

@Component({
    selector: 'layout-header-mobile',
    templateUrl: 'header.mobile.component.html',
    styleUrls: ['./header.mobile.component.scss']
})
export class LayoutHeaderMobileComponent {
    logo = AppConfig.Logo;
    constructor(public data: AdminDataService) {

    }

    toggleMenuAside() {
        setTimeout(() => {
            this.data.activeMenuAside = !this.data.activeMenuAside;
        }, 100);
    }

    toggleMenuHeader() {
        setTimeout(() => {
            this.data.activeMenuHeader = !this.data.activeMenuHeader;
        }, 100);
    }

    toggleMenuUser() {
        document.getElementsByTagName('body')[0].classList.toggle("kt-header__topbar--mobile-on");
    }
}
