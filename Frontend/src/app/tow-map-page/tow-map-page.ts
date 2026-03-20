import { Component } from '@angular/core';
import { LeafletMap } from '../leaflet-map/leaflet-map';
import { TowUserList } from '../tow-user-list/tow-user-list';
import { TowUser } from '../models/towuser.model';
import { AuthUser } from '../auth-service';

@Component({
  selector: 'app-tow-map-page',
  imports: [LeafletMap, TowUserList],
  templateUrl: './tow-map-page.html',
  styleUrl: './tow-map-page.css',
})
export class TowMapPage {
  towUsers: TowUser[] = [];

  
}
