import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { setEnvironment } from '../../app.config';
import { ActionType } from '../../core/domains/enums/action.type';
import { AdminAuthService } from '../../core/services/admin.auth.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AdminAuthService) {
        setEnvironment();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        let account = this.authService.account,
            stateUrl = state.url.replace('/admin', '')
                .replace('/allcategory', '');
        if (stateUrl.indexOf('?') >= 0) {
            stateUrl = stateUrl.split('?')[0];
        }
        if (account) {
            if (account.Locked) {
                if (stateUrl.indexOf('/admin/lock') == -1) {
                    this.router.navigate(['/admin/lock'], { queryParams: { returnUrl: state.url } });
                }
                return false;
            }
            let urls = stateUrl.split('/').filter(c => c != null && c.length > 0),
                controller = urls[0],
                action = urls[1];
            return new Promise((resolve, reject) => {
                let actionType = action || ActionType.View;
                if (actionType == 'add') actionType = ActionType.AddNew;
                if (actionType == 'view') actionType = ActionType.ViewDetail;
                this.authService.permissionAllow(controller, actionType).then((allow: boolean) => {
                    if (allow) {
                        resolve(true);
                    }
                    else {
                        resolve(false);
                        this.router.navigate(['/admin/error/403']);
                    }
                });
            });
        } else {
            let url = state.url.indexOf('/admin/lock') >= 0 ? '/' : state.url;
            this.router.navigate(['/admin/signin'], { queryParams: { returnUrl: url } });
            return false;
        }
    }
}