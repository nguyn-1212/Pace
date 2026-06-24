import { Injectable } from '@angular/core';
import { ApiUrl } from '../../../core/helpers/api.url.helper';
import { MethodType } from '../../../core/domains/enums/method.type';
import { AdminApiService } from '../../../core/services/admin.api.service';
import { AdminUserUpdateDto } from '../../../core/domains/objects/user.dto';

@Injectable()
export class UserService extends AdminApiService {
    async unLockUser(id: number) {
        const api = ApiUrl.ToUrl('/admin/user/unlock/' + id);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async allUsers() {
        let api = ApiUrl.ToUrl('/admin/user/allusers');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async allDistricts(userId: number) {
        let api = userId 
            ? ApiUrl.ToUrl('/admin/district/alldistricts/' + userId)
            : ApiUrl.ToUrl('/admin/district/alldistricts');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async adminResetPassword(id: number) {
        const api = ApiUrl.ToUrl('/admin/user/sendverifycode/' + id);
        return await this.ToResultApi(api, MethodType.Post);
    }
    async adminSendMailActive(email: string) {
        const api = ApiUrl.ToUrl('/admin/security/adminSendMailActive');
        return await this.ToResultApi(api, MethodType.Post, { Email: email });
    }
    async allUsersByRoleId(roleId: number) {
        let api = ApiUrl.ToUrl('/admin/user/allUsersByRoleId/' + roleId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async allUsersByTeamId(teamId: number) {
        let api = ApiUrl.ToUrl('/admin/user/allUsersByTeamId/' + teamId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async allUsersByProductId(productId: number) {
        let api = ApiUrl.ToUrl('/admin/user/allUsersByProductId/' + productId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async lockUser(id: number, reason: string) {
        const api = ApiUrl.ToUrl('/admin/user/lock/' + id);
        let obj = {
            ReasonLock: reason
        };
        return await this.ToResultApi(api, MethodType.Post, obj);
    }
    async addOrUpdate(item: AdminUserUpdateDto) {
        delete item.Id;
        delete item.Status;
        const api = ApiUrl.ToUrl('/admin/security/adminAddOrUpdate');        
        return await this.ToResultApi(api, MethodType.Put, item);
    }
    async allUsersByPositionId(positionId: number) {
        let api = ApiUrl.ToUrl('/admin/user/allUsersByPositionId/' + positionId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async allUsersByDepartmentId(departmentId: number) {
        let api = ApiUrl.ToUrl('/admin/user/allUsersByDepartmentId/' + departmentId);
        return await this.ToResultApi(api, MethodType.Get);
    }
    async allRoles(userId: number) {
        let api = userId 
            ? ApiUrl.ToUrl('/admin/role/allroles/' + userId)
            : ApiUrl.ToUrl('/admin/role/allroles');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async allTeams(userId: number) {
        let api = userId 
            ? ApiUrl.ToUrl('/admin/team/allteams/' + userId)
            : ApiUrl.ToUrl('/admin/team/allteams');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async allProducts(userId: number) {
        let api = userId 
            ? ApiUrl.ToUrl('/admin/product/allproducts/' + userId)
            : ApiUrl.ToUrl('/admin/product/allproducts');
        return await this.ToResultApi(api, MethodType.Get);
    }
    async allPermissions(userId: number, roleIds: number[]) {
        let api = userId 
            ? ApiUrl.ToUrl('/admin/permission/allpermissions/' + userId)
            : ApiUrl.ToUrl('/admin/permission/allpermissions');
        if (roleIds && roleIds.length > 0)
            api += '?roleIds=' + roleIds;
        return await this.ToResultApi(api, MethodType.Get);
    }
    async generateAuthenticator(userId: number) {
        let api = ApiUrl.ToUrl('/admin/user/GenerateAuthenticator/' + userId);
        return await this.ToResultApi(api, MethodType.Post);
    }
}