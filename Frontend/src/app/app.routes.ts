import { Routes } from '@angular/router';
import { map } from 'rxjs';
import { LeafletMap } from './leaflet-map/leaflet-map';
import { TowMapPage } from './tow-map-page/tow-map-page';

export const routes: Routes = [
    {path: '', component: TowMapPage}
];
