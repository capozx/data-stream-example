import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataStreamGeneratorService} from "./services/data-stream-generator.service";
import {Observable, Subscription} from "rxjs";
import {IndexedDbService} from "./services/indexed-db.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'data-stream-example';

  readonly howManyGenerators: number = 7;
  subscriptions: Subscription[] = [];
  dataGenerators$: Observable<number>[] = [];

  constructor(
    private dataStreamGenerator: DataStreamGeneratorService,
    private indexedDbService: IndexedDbService
  ) {}

  ngOnInit(): void {
    this.indexedDbService.resetDatabase();
    this.indexedDbService.setHowManyStores(this.howManyGenerators);

    this.dataGenerators$ = this.dataStreamGenerator.buildDataGenerators(this.howManyGenerators);

    this.dataGenerators$.forEach((dataGenerator: Observable<number>, index: number) => {
      this.subscriptions.push(
        dataGenerator.subscribe((data: number) => {
          // console.debug("data from generator", index, data);
          this.indexedDbService.saveData(index, data).subscribe({
            error: (e) => console.error("unable to store data", e)
          });
        })
      );
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription) {
        subscription.unsubscribe();
      }
    })
  }

}
