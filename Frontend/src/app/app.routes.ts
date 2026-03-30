import { Routes } from '@angular/router';
import { map } from 'rxjs';
import { LeafletMap } from './leaflet-map/leaflet-map';
import { TowMapPage } from './tow-map-page/tow-map-page';
import { ProfilePanelComp } from './profile-panel-comp/profile-panel-comp';

export const routes: Routes = [
  {
    path: '',
    component: TowMapPage
  },
  {
    path: 'profile',
    component: ProfilePanelComp
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./about-comp/about-comp').then((m) => m.AboutComp)
  }
];
