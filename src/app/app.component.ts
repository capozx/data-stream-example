import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataStreamGeneratorService} from "./services/data-stream-generator.service";
import {Observable, Subscription} from "rxjs";
import {IndexedDbService} from "./services/indexed-db.service";
import {interval} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'data-stream-example';

  readonly howManyGenerators: number = 7;
  readonly samplingInterval: number = 500;
  subscriptions: Subscription[] = [];
  dataGenerators$: Observable<number>[] = [];
  updatedDataFromGenerators: number[] = [];
  readonly samplingClock$: Observable<number> = interval(this.samplingInterval);

  constructor(
    private dataStreamGenerator: DataStreamGeneratorService,
    private indexedDbService: IndexedDbService
  ) {}

  ngOnInit(): void {
    for (let updatedDataIndex = 0; updatedDataIndex < this.howManyGenerators; updatedDataIndex++) {
      this.updatedDataFromGenerators.push(0);
    }

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
        }),


        this.samplingClock$.subscribe(() => {
           this.indexedDbService.getLastDataFromStore(index).subscribe((upToDatedata) => {
             this.updatedDataFromGenerators[index] = upToDatedata;
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
