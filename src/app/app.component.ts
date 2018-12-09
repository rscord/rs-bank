import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Item } from './classes/item/item';
import { Spells } from './classes/spells';
import { DomSanitizer } from '@angular/platform-browser';
import { ItemDescriptor } from './classes/item/item-descriptor';
import { PackedItemIconLoader } from './classes/item/icon-loader/packed-item-icon-loader';
import { UrlItemIconLoader } from './classes/item/icon-loader/url-item-icon-loader';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  packedIcons: boolean;
  stages: any[];

  constructor(private http: HttpClient,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone) {
    this.stages = [];
    this.packedIcons = false;
  }

  async ngOnInit() {
    this.setStage('Loading settings...');
    const settings = await this.req<any>('assets/settings.json');
    this.setStage('Loading spells...');
    const spells = await this.req<any[]>('assets/spells.json');
    this.setStage('Loading items...');
    const items = await this.req<ItemDescriptor[]>('assets/items.json');
    this.setStage('Loading item icons...');
    let iconLoader;
    if (this.packedIcons) {
      const icons = await this.req<ArrayBuffer>('assets/item_icons.txt', 'arraybuffer');
      iconLoader = new PackedItemIconLoader(icons, this.sanitizer);
    } else if (environment.production) {
      iconLoader = new UrlItemIconLoader('assets/item-icon/:id.gif');
    } else {
      iconLoader = new UrlItemIconLoader('https://rscord.github.io/assets/item-icon/:id.gif');
    }
    this.setStage('Finishing up...');
    Item.init(iconLoader, items);
    Spells.init(spells);
    this.ngZone.run(() => this.stages = null);
  }

  setStage(msg: string) {
    const stage = this.stages[this.stages.length - 1];
    if (stage) {
      if (stage[0] === msg) {
        return;
      }
      stage[1] = 100;
    }
    this.stages.push([msg, 0]);
    this.cd.detectChanges();
  }

  setProgress(progress: number) {
    const stage = this.stages[this.stages.length - 1];
    if (stage) {
      stage[1] = progress;
      this.cd.detectChanges();
    }
  }

  req<T>(url: string, responseType?: string): Promise<T> {
    return new Promise((resolve) => {
      const req = new HttpRequest('GET', url, {
        responseType,
        reportProgress: true
      });
      this.http.request(req).subscribe((a: HttpEvent<T>) => {
        switch (a.type) {
          case HttpEventType.DownloadProgress:
            this.setProgress(Math.round(100 * a.loaded / a.total));
            break;
          case HttpEventType.Response:
            resolve(a.body);
            break;
        }
      });
    });
  }

}
