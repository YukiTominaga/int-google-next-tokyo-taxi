import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TaxiService } from '../../services/taxi/taxi.service';
import { DisplayTaxies } from '../../models/DisplayTaxies';
import { Map } from '../../models/Map';

@Component({
  selector: 'taxi-root',
  templateUrl: './taxi-map.component.html',
  styleUrls: ['./taxi-map.component.scss']
})
export class TaxiMapComponent implements OnInit, AfterViewInit {
  private map: google.maps.Map;

  constructor(private taxiService: TaxiService) { }

  ngOnInit() {}

  async ngAfterViewInit() {
    this.map = new Map(35.6552675, 139.7448379, document.getElementById('gmap')).map;
    this.map.setOptions({
      mapTypeControl: false,
      streetViewControl: false,
    });

    const title = document.getElementsByClassName('title')[0];
    const legend = document.getElementsByClassName('legend')[0];

    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(title); // display title on TOP_LEFT
    this.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend); // display legend on LEFT_BOTTOM

    const displayTaxies = new DisplayTaxies(this.taxiService, this.map);

    await this.map.addListener('dragend', async () => {
      await displayTaxies.resetDisplayedTaxies();
      await displayTaxies.refresh();
    });

    await this.map.addListener('click', async () => {
      await displayTaxies.closeInfoWindows();
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => displayTaxies.refresh());
  }

}
