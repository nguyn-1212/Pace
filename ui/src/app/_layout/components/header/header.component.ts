import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../../core/helpers/app.config';
import { ResultApi } from '../../../core/domains/data/result.api';
import { EntityHelper } from '../../../core/helpers/entity.helper';
import { ToastrHelper } from '../../../core/helpers/toastr.helper';
import { NotifyDto } from '../../../core/domains/objects/notify.dto';
import { MethodType } from '../../../core/domains/enums/method.type';
import { AdminApiService } from '../../../core/services/admin.api.service';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminDataService } from '../../../core/services/admin.data.service';
import { AdminAuthService } from '../../../core/services/admin.auth.service';
import { UserActivityHelper } from '../../../core/helpers/user.activity.helper';
import { AdminDialogService } from '../../../core/services/admin.dialog.service';
import { LinkPermissionDto } from '../../../core/domains/objects/link.permission.dto';
import { AdminTranslateService } from '../../../core/services/admin.translate.service';
import { AdminUserDto, AdminUserLoginDto, UserDto } from '../../../core/domains/objects/user.dto';
import { ModalViewProfileComponent } from '../../../core/modal/view.profile/view.profile.component';
import { ModalEditProfileComponent } from '../../../core/modal/edit.profile/edit.profile.component';
import { ModalChangePasswordComponent } from '../../../core/modal/change.password/change.password.component';

@Component({
    selector: 'layout-header',
    templateUrl: 'header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class LayoutHeaderComponent implements OnInit {
    activeUser: boolean;
    processing: boolean;
    languageText: string;
    languageIcon: string;
    activeNotify: boolean;
    activeLanguage: boolean;
    processingNotify: boolean;

    notifies: NotifyDto[];
    unreadNotifyCount: string;

    loading: boolean;
    currentUrl: string;
    loginItem: UserDto;
    appVersion = '1.0';
    account: AdminUserDto;
    accountLetter: string;

    constructor(
        public router: Router,
        public data: AdminDataService,
        public authen: AdminAuthService,
        public service: AdminApiService,
        public dialog: AdminDialogService,
        public translate: AdminTranslateService) {
        this.loginItem = EntityHelper.createEntity(UserDto);
    }

    async ngOnInit() {
        await this.loadNotifies();
        this.account = this.authen.account;
        if (this.account) {
            let accountName = this.account.UserName || this.account.Email;
            this.accountLetter = accountName && accountName.substr(0, 1).toUpperCase();
        }

        this.switchLanguageIcon(AppConfig.Language);
    }

    lock() {
        this.activeUser = false;
        this.authen.lock();
    }

    logout() {
        this.activeUser = false;
        this.authen.logout();
    }

    closeAside() {
        if (this.data.activeMenuHeader) {
            this.data.activeMenuHeader = false;
        }
    }

    async login() {
        this.processing = true;
        let password = AppConfig.DefaultPassword;
        let obj: AdminUserLoginDto = {
            RememberMe: false,
            UserName: this.loginItem.Account,
            Password: UserActivityHelper.CreateHash256(password),
            Activity: await UserActivityHelper.UserActivity(this.data.countryIp),
        }
        this.service.signinOther(obj).then(async (result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                await this.authen.login(result.Object, obj.RememberMe, false);
            } else ToastrHelper.ErrorResult(result);
            this.processing = false;
            location.reload();
        }, (ex: any) => {
            this.processing = false;
            ToastrHelper.Exception(ex);
        });
    }

    onImgError(event: any) {
        event.target.src = AppConfig.SchemaWeb + '/assets/media/users/default.jpg';
    }

    public readAllNotifies() {
        this.processingNotify = true;
        this.service.callApiUrl('/notify/readAllNotify', null, MethodType.Post).then(async (result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                await this.loadNotifies();
            }
            this.processingNotify = false;
        });
    }

    public popupViewProfile() {
        this.activeUser = false;
        this.dialog.WapperAsync({
            cancelText: 'Close',
            size: ModalSizeType.Large,
            title: 'Account Information',
            object: ModalViewProfileComponent,
            confirmText: 'Edit Information',
        }, async () => {
            setTimeout(() => {
                this.dialog.WapperAsync({
                    cancelText: 'Close',
                    confirmText: 'Update',
                    size: ModalSizeType.Large,
                    title: 'Edit Account Information',
                    object: ModalEditProfileComponent,
                });
            }, 100);
        });
    }

    public popupChangepassword() {
        this.activeUser = false;
        this.dialog.WapperAsync({
            confirmText: 'Confirm',
            title: 'Change Password',
            object: ModalChangePasswordComponent,
        });
    }


    switchLanguage(language: string) {
        this.translate.use(language);
        this.switchLanguageIcon(language);
        location.reload();
    }

    switchLanguageIcon(language: string) {
        switch (language) {
            case 'en':
                this.languageText = 'English';
                this.languageIcon = '../../../../assets/media/svg/flags/226-united-states.svg';
                break;
            case 'vi':
                this.languageText = 'Tiếng Việt';
                this.languageIcon = '../../../../assets/media/svg/flags/220-vietnam.svg';
                break;
            case 'de':
                this.languageText = 'Deutsch';
                this.languageIcon = '../../../../assets/media/svg/flags/017-germany.svg';
                break;
        }
    }

    public popupNotify(notify: NotifyDto) {
        if (!notify.IsRead) {
            this.service.callApiUrl('/notify/readNotify/' + notify.Id, null, MethodType.Post).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    notify.IsRead = true;
                    let count = this.notifies?.filter(c => !c.IsRead)?.length;
                    this.unreadNotifyCount = count > 20 ? '20+' : (count ? count.toString() : '');
                }
            });
        }
        let content = notify.Content
            ? '<p>' + notify.Title + '</p><p>' + notify.Content + '</p><p>Thời gian: ' + notify.RelativeTime + '</p>'
            : '<p>' + notify.Title + '</p><p>Thời gian: <b>' + notify.RelativeTime + '</b></p>';
        this.dialog.Alert('Thông báo', content);
    }

    toggleMenuUser() {
        this.activeUser = !this.activeUser;
        if (this.activeUser) {
            this.activeNotify = false;
            this.activeLanguage = false;
        }
    }
    toggleMenuNotify() {
        this.activeNotify = !this.activeNotify;
        if (this.activeNotify) {
            this.activeUser = false;
            this.activeLanguage = false;
        }
    }
    toggleMenuLanguage() {
        this.activeLanguage = !this.activeLanguage;
        if (this.activeLanguage) {
            this.activeUser = false;
            this.activeNotify = false;
        }
    }

    navigateActivity() {
        this.activeUser = false;
        this.router.navigateByUrl('/admin/useractivity');
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
    navigateCtrl(childItem: LinkPermissionDto) {
        this.activeUser = false;
        let url = AppConfig.getProtocol() + '//' + AppConfig.getDomain() + childItem.Link;
        window.open(url, "_blank");
    }

    private async loadNotifies() {
        await this.service.unreadNotifies().then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.notifies = result.Object as NotifyDto[];
                let count = this.notifies?.filter(c => !c.IsRead)?.length;
                this.unreadNotifyCount = count > 20 ? '20+' : (count ? count.toString() : '');
            }
        });
    }
}
