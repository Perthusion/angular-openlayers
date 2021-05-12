import { Component, OnInit, VERSION } from '@angular/core';
import { Map, View, Feature, Overlay } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { XYZ, Vector as VectorSource } from 'ol/source';
import { GeoJSON } from 'ol/format';
import { Point } from 'ol/geom';
import * as olProj from 'ol/proj';
import * as olCoord from 'ol/coordinate';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  map: Map;

  container;
  content;
  closer;
  overlay;

  ngOnInit(): void {
    this.map = new Map({
      target: 'ol-map',
      layers: [
        new TileLayer({
          source: new XYZ({ url: 'https://{a-c}.tile.osm.org/{z}/{x}/{y}.png' })
        }),
        new VectorLayer({
          url:
            'https://openlayers.org/en/latest/examples/data/geojson/countries.geojson',
          format: new GeoJSON()
        })
      ],
      view: new View({
        center: olProj.fromLonLat([5.7503, 45.1803]),
        zoom: 11
      })
    });
    var layer = new VectorLayer({
      source: new VectorSource({
        features: [
          new Feature({
            geometry: new Point(olProj.fromLonLat([5.72412, 45.1786]))
          }),
          new Feature({
            geometry: new Point(olProj.fromLonLat([5.69662, 45.17601]))
          })
        ]
      })
    });
    this.map.addLayer(layer);

    this.container = document.getElementById('popup');
    this.content = document.getElementById('popup-content');    
    this.closer = document.getElementById('popup-closer');

    this.overlay = new Overlay({
      element: this.container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    this.map.addOverlay(this.overlay);

    /*this.map.on('singleclick', function(event) {
      if (this.map.hasFeatureAtPixel(event.pixel) === true) {
        var coordinate = event.coordinate;

        this.content.innerHTML = '<b>Hello world!</b><br />I am a popup.';
        this.overlay.setPosition(coordinate);
      } else {
        this.overlay.setPosition(undefined);
        this.closer.blur();
      }
    });*/

    this.map.on('singleclick', function(evt) {
      var coordinate = evt.coordinate;
      var hdms = olCoord.toStringHDMS(olProj.toLonLat(coordinate));
      console.log(this.content);
      this.content.innerHTML =
        '<p>You clicked here:</p><code>' + hdms + '</code>';
      this.overlay.setPosition(coordinate);
    });
  }

  onClosePopupClick() {
    this.overlay.setPosition(undefined);
    this.closer.blur();
  }

  onMapClick(event) {
    console.log(event);
    if (this.map.hasFeatureAtPixel(event.pixel) === true) {
      console.log('event.pixel true');
      var coordinate = event.coordinate;

      this.content.innerHTML = '<b>Hello world!</b><br />I am a popup.';
      this.overlay.setPosition(coordinate);
    } else {
      console.log('event.pixel false');
      this.overlay.setPosition(undefined);
      this.closer.blur();
    }
  }
}
