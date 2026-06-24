declare var $: any
declare var require: any
import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppConfig } from '../../../core/helpers/app.config';
import { ResultApi } from '../../../core/domains/data/result.api';
import { AdminApiService } from '../../../core/services/admin.api.service';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthService } from '../../../core/services/admin.auth.service';
import { AdminDataService } from '../../../core/services/admin.data.service';
import { AdminEventService } from '../../../core/services/admin.event.service';
import { AdminDialogService } from '../../../core/services/admin.dialog.service';
import { LinkPermissionDto } from '../../../core/domains/objects/link.permission.dto';
import { ChangePasswordComponent } from '../change.password/change.password.component';

@Component({
    selector: 'layout-aside',
    templateUrl: 'aside.component.html',
    styleUrls: ['./aside.component.scss'],
})
export class LayoutAsideComponent implements OnInit {
    fundFee: number;
    loading: boolean;
    currentUrl: string;
    activeUser: boolean;
    fundCapital: number;
    logo = AppConfig.Logo;
    
    constructor(
        public router: Router,
        public data: AdminDataService,
        public authen: AdminAuthService,
        public event: AdminEventService,
        public dialog: AdminDialogService,
        public service: AdminApiService) {
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.currentUrl = val.url
                    .replace('/add', '')
                    .replace('/edit', '');
                if (this.currentUrl.indexOf('/signin') == -1)
                    this.activeLink();
            }
        });
        this.event.RefreshMenus.subscribe(async () => {
            this.reloadLinks();
        });
    }

    ngOnInit() {
        this.reloadLinks();
    }

    closeAside() {
        if (this.data.activeMenuAside) {
            this.data.activeMenuAside = false;
        }
    }

    toggleAside() {
        $('body').toggleClass('kt-aside--minimize');
        this.data.activeMenuAside = !this.data.activeMenuAside;
    }

    toggleActiveLink(item: LinkPermissionDto) {
        item.Active = !item.Active;
    }

    private async reloadLinks() {
        await this.authen.loadLinkPermissions();
        this.activeLink();
    }

    private async activeLink() {
        if (this.authen.links && this.authen.links.length > 0) {
            let links = _.cloneDeep(this.authen.links),
                statisticDatas = null;
            links.forEach((group: any) => {
                if (group && group.items && group.items.length > 0) {
                    group.items.forEach((item: LinkPermissionDto) => {
                        if (item.Childrens && item.Childrens.length > 0) {
                            item.Childrens.forEach((child: LinkPermissionDto) => {
                                if (statisticDatas && child.Name && child.Name.indexOf('(') >= 0) {
                                    for (let i = 1; i < 10; i++) {
                                        let statusO = statisticDatas.find(c => c.Status == 'O' + i),
                                            countO = statusO ? statusO.Count : null;
                                        child.Name = countO
                                            ? child.Name.replace('O' + i, countO)
                                            : child.Name.replace('(O' + i + ')', '');

                                        let statusA = statisticDatas.find(c => c.Status == 'A' + i),
                                            countA = statusA ? statusA.Count : null;
                                        child.Name = countA
                                            ? child.Name.replace('A' + i, countA)
                                            : child.Name.replace('(A' + i + ')', '');

                                        let statusT = statisticDatas.find(c => c.Status == 'T' + i),
                                            countT = statusT ? statusT.Count : null;
                                        child.Name = countT
                                            ? child.Name.replace('T' + i, countT)
                                            : child.Name.replace('(T' + i + ')', '');
                                    }
                                }
                                if (child.Link == this.currentUrl) {
                                    item.Active = true;
                                    child.Active = true;
                                }
                            });
                        } else {
                            if (item.Link == this.currentUrl) {
                                item.Active = true;
                            }
                        }
                    });
                }
            });

            this.authen.links = links;
        }
    }

    navigate(childItem: LinkPermissionDto) {
        this.closeAside();
        childItem.Active = true;
        if (this.authen.links && this.authen.links.length > 0) {
            let links = _.cloneDeep(this.authen.links);
            links.forEach((group: any) => {
                if (group && group.items && group.items.length > 0) {
                    group.items.forEach((item: LinkPermissionDto) => {
                        item.Active = false;
                        if (item.Childrens && item.Childrens.length > 0) {
                            item.Childrens.forEach((child: LinkPermissionDto) => {
                                child.Active = false;
                                if (child.Link == childItem.Link) {
                                    item.Active = true;
                                    child.Active = true;
                                }
                            });
                        } else {
                            if (item.Link == childItem.Link) {
                                item.Active = true;
                            }
                        }
                    });
                }
            });

            this.authen.links = links;
        }
        this.router.navigateByUrl(childItem.Link);
    }


    navigateToUserProfile() {
        
    }

    changePassword() {
        this.dialog.WapperAsync({
            confirmText: 'Confirm',
            title: 'Change Password',
            size: ModalSizeType.Medium,
            object: ChangePasswordComponent,
        });
    }
    logout() {
        this.activeUser = false;
        this.authen.logout();
    }
    

    lockScreen() {
        this.activeUser = false;
        this.authen.lock();
    }

}
