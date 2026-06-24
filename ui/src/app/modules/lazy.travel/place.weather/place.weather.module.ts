import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../core/domains/data/grid.data';
import { ActionData } from '../../../core/domains/data/action.data';
import { ModalSizeType } from '../../../core/domains/enums/modal.size.type';
import { AdminAuthGuard } from '../../../_app.core/guards/admin.auth.guard';
import { GridComponent } from '../../../core/components/grid/grid.component';
import { NavigationStateData } from '../../../core/domains/data/navigation.state';
import { PlaceWeatherEntity } from '../../../_app.core/domains/entities/place.weather.entity';
import { EditPlaceWeatherComponent } from './edit.place.weather/edit.place.weather.component';

@Component({ templateUrl: '../../../core/components/grid/grid.component.html' })
export class PlaceWeatherComponent extends GridComponent {
    obj: GridData = {
        Reference: PlaceWeatherEntity,
        Size: ModalSizeType.Large,
        Imports: [], Exports: [],
        Properties: ['Id','PlaceId','Date','TempHigh','TempLow','Condition','Humidity','WindSpeed'],
        Features: [ActionData.reload(() => this.loadItems())],
    };
    constructor() { super(); this.render(this.obj); }
    addNew() {
        const obj: NavigationStateData = { prevUrl: '/admin/placeweather', prevData: this.itemData };
        this.router.navigate(['/admin/placeweather/add'], { state: { params: JSON.stringify(obj) } });
    }
    edit(item: PlaceWeatherEntity) {
        const obj: NavigationStateData = { id: item.Id, prevUrl: '/admin/placeweather', prevData: this.itemData };
        this.router.navigate(['/admin/placeweather/edit'], { state: { params: JSON.stringify(obj) } });
    }
    view(item: PlaceWeatherEntity) {
        const obj: NavigationStateData = { id: item.Id, viewer: true, prevUrl: '/admin/placeweather', prevData: this.itemData };
        this.router.navigate(['/admin/placeweather/view'], { state: { params: JSON.stringify(obj) } });
    }
}
@NgModule({
    declarations: [PlaceWeatherComponent, EditPlaceWeatherComponent],
    imports: [UtilityModule, RouterModule.forChild([
        { path: '', component: PlaceWeatherComponent, pathMatch: 'full', data: { state: 'placeweather' }, canActivate: [AdminAuthGuard] },
        { path: 'add', component: EditPlaceWeatherComponent, pathMatch: 'full', data: { state: 'add_placeweather' }, canActivate: [AdminAuthGuard] },
        { path: 'edit', component: EditPlaceWeatherComponent, pathMatch: 'full', data: { state: 'edit_placeweather' }, canActivate: [AdminAuthGuard] },
        { path: 'view', component: EditPlaceWeatherComponent, pathMatch: 'full', data: { state: 'view_placeweather' }, canActivate: [AdminAuthGuard] },
    ])]
})
export class PlaceWeatherModule {}
