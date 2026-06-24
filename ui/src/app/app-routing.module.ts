import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminAuthGuard } from './_app.core/guards/admin.auth.guard';

// Layout
import { LayoutComponent } from './_layout/layout.component';
import { LayoutSignInComponent } from './_layout/signin/template.signin.component';

@NgModule({
  imports: [    
    RouterModule.forRoot([
      {
        path: 'admin',
        component: LayoutComponent,
        children: [          
          { path: 'team', loadChildren: () => import('./modules/common/team/team.module').then(m => m.TeamModule) },
          { path: 'error', loadChildren: () => import('./core/modules/error/error.module').then(m => m.ErrorModule) },
          { path: 'user', loadChildren: () => import('./modules/sercurity/user/user.module').then(m => m.UserModule) },
          { path: 'role', loadChildren: () => import('./modules/sercurity/role/role.module').then(m => m.RoleModule) },
          { path: 'notify', loadChildren: () => import('./modules/common/notify/notify.module').then(m => m.NotifyModule) },
          { path: 'language', loadChildren: () => import('./modules/common/language/language.module').then(m => m.LanguageModule) },
          { path: 'allcategory', loadChildren: () => import('./modules/common/all.category.module').then(m => m.AllCategoryModule) },
          { path: 'department', loadChildren: () => import('./modules/common/department/department.module').then(m => m.DepartmentModule) },
          { path: 'permission', loadChildren: () => import('./modules/sercurity/permission/permission.module').then(m => m.PermissionModule) },
          { path: 'smtpaccount', loadChildren: () => import('./modules/common/smtp.account/smtp.account.module').then(m => m.SmtpAccountModule) },
          { path: 'logactivity', loadChildren: () => import('./modules/common/log.activity/log.activity.module').then(m => m.LogActivityModule) },
          { path: 'logexception', loadChildren: () => import('./modules/common/log.exception/log.exception.module').then(m => m.LogExceptionModule) },
          { path: 'configuration', loadChildren: () => import('./modules/common/configuration/configuration.module').then(m => m.ConfigurationModule) },
          { path: 'useractivity', loadChildren: () => import('./modules/sercurity/user.activity/user.activity.module').then(m => m.UserActivityModule) },
          { path: 'emailtemplate', loadChildren: () => import('./modules/common/email.template/email.template.module').then(m => m.EmailTemplateModule) },
          // Lazy Travel
          { path: 'userprofile', loadChildren: () => import('./modules/lazy.travel/user.profile/user.profile.module').then(m => m.UserProfileModule) },
          { path: 'userinterest', loadChildren: () => import('./modules/lazy.travel/user.interest/user.interest.module').then(m => m.UserInterestModule) },
          { path: 'userbadge', loadChildren: () => import('./modules/lazy.travel/user.badge/user.badge.module').then(m => m.UserBadgeModule) },
          { path: 'userbankaccount', loadChildren: () => import('./modules/lazy.travel/user.bank.account/user.bank.account.module').then(m => m.UserBankAccountModule) },
          { path: 'friendship', loadChildren: () => import('./modules/lazy.travel/friendship/friendship.module').then(m => m.FriendshipModule) },
          { path: 'placetag', loadChildren: () => import('./modules/lazy.travel/place.tag/place.tag.module').then(m => m.PlaceTagModule) },
          { path: 'placereview', loadChildren: () => import('./modules/lazy.travel/place.review/place.review.module').then(m => m.PlaceReviewModule) },
          { path: 'expensesplit', loadChildren: () => import('./modules/lazy.travel/expense.split/expense.split.module').then(m => m.ExpenseSplitModule) },
          { path: 'voteoption', loadChildren: () => import('./modules/lazy.travel/vote.option/vote.option.module').then(m => m.VoteOptionModule) },
          { path: 'tripinvitelink', loadChildren: () => import('./modules/lazy.travel/trip.invite.link/trip.invite.link.module').then(m => m.TripInviteLinkModule) },
          // Lazy Travel - Standard Modules
          { path: 'trip', loadChildren: () => import('./modules/lazy.travel/trip/trip.module').then(m => m.TripModule) },
          { path: 'tripmember', loadChildren: () => import('./modules/lazy.travel/trip.member/trip.member.module').then(m => m.TripMemberModule) },
          { path: 'tripday', loadChildren: () => import('./modules/lazy.travel/trip.day/trip.day.module').then(m => m.TripDayModule) },
          { path: 'tripactivity', loadChildren: () => import('./modules/lazy.travel/trip.activity/trip.activity.module').then(m => m.TripActivityModule) },
          { path: 'place', loadChildren: () => import('./modules/lazy.travel/place/place.module').then(m => m.PlaceModule) },
          { path: 'placeweather', loadChildren: () => import('./modules/lazy.travel/place.weather/place.weather.module').then(m => m.PlaceWeatherModule) },
          { path: 'expense', loadChildren: () => import('./modules/lazy.travel/expense/expense.module').then(m => m.ExpenseModule) },
          { path: 'tripsettlement', loadChildren: () => import('./modules/lazy.travel/trip.settlement/trip.settlement.module').then(m => m.TripSettlementModule) },
          { path: 'expensesettlement', loadChildren: () => import('./modules/lazy.travel/expense.settlement/expense.settlement.module').then(m => m.ExpenseSettlementModule) },
          { path: 'vote', loadChildren: () => import('./modules/lazy.travel/vote/vote.module').then(m => m.VoteModule) },
          { path: 'tripannouncement', loadChildren: () => import('./modules/lazy.travel/trip.announcement/trip.announcement.module').then(m => m.TripAnnouncementModule) },
          { path: 'tripdoc', loadChildren: () => import('./modules/lazy.travel/trip.doc/trip.doc.module').then(m => m.TripDocModule) },
          { path: 'photoalbum', loadChildren: () => import('./modules/lazy.travel/photo.album/photo.album.module').then(m => m.PhotoAlbumModule) },
          { path: 'tripphoto', loadChildren: () => import('./modules/lazy.travel/trip.photo/trip.photo.module').then(m => m.TripPhotoModule) },
          { path: 'checkin', loadChildren: () => import('./modules/lazy.travel/check.in/check.in.module').then(m => m.CheckInModule) },
          { path: 'chatmessage', loadChildren: () => import('./modules/lazy.travel/chat.message/chat.message.module').then(m => m.ChatMessageModule) },
          { path: 'explorearticle', loadChildren: () => import('./modules/lazy.travel/explore.article/explore.article.module').then(m => m.ExploreArticleModule) },
          { path: 'triptemplate', loadChildren: () => import('./modules/lazy.travel/trip.template/trip.template.module').then(m => m.TripTemplateModule) },
          { path: 'timelineentry', loadChildren: () => import('./modules/lazy.travel/timeline.entry/timeline.entry.module').then(m => m.TimelineEntryModule) },
          { path: 'notificationsetting', loadChildren: () => import('./modules/lazy.travel/notification.setting/notification.setting.module').then(m => m.NotificationSettingModule) },
          { path: 'userappsetting', loadChildren: () => import('./modules/lazy.travel/user.app.setting/user.app.setting.module').then(m => m.UserAppSettingModule) },
          { path: 'useractivitystat', loadChildren: () => import('./modules/lazy.travel/user.activity.stat/user.activity.stat.module').then(m => m.UserActivityStatModule) },
          { path: 'userlocationhistory', loadChildren: () => import('./modules/lazy.travel/user.location.history/user.location.history.module').then(m => m.UserLocationHistoryModule) },
          { path: 'userprivacysetting', loadChildren: () => import('./modules/lazy.travel/user.privacy.setting/user.privacy.setting.module').then(m => m.UserPrivacySettingModule) },
          { path: 'triptemplateactivity', loadChildren: () => import('./modules/lazy.travel/trip.template.activity/trip.template.activity.module').then(m => m.TripTemplateActivityModule) },
          { path: 'linkpermission', loadChildren: () => import('./modules/sercurity/link.permission/link.permission.module').then(m => m.LinkPermissionModule) },
          { path: '', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AdminAuthGuard] },
        ]
      },
      {
        path: 'admin/lock',
        component: LayoutSignInComponent,
        children: [          
          { path: '', loadChildren: () => import('./modules/sercurity/lock/lock.module').then(m => m.LockModule) },
        ]
      },
      {
        path: 'admin/signin',
        component: LayoutSignInComponent,
        children: [          
          { path: '', loadChildren: () => import('./modules/sercurity/signin/signin.module').then(m => m.SignInModule) },
        ]
      },
      {
        path: 'admin/verify',
        component: LayoutSignInComponent,
        children: [          
          { path: '', loadChildren: () => import('./modules/sercurity/verify/verify.module').then(m => m.VerifyModule) },
        ]
      },
      {
        path: 'admin/resetpassword',
        component: LayoutSignInComponent,
        children: [          
          { path: '', loadChildren: () => import('./modules/sercurity/reset.password/reset.password.module').then(m => m.ResetPasswordModule) },
        ]
      },
      {
        path: '',
        pathMatch:'full',
        redirectTo: '/admin',
      },
      {
        path: '**',
        redirectTo: '/admin/error/404',
      },
    ]),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

