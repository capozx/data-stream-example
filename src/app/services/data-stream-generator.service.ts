import { Injectable } from '@angular/core';
import {interval, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataStreamGeneratorService {

  private readonly generatorMaxValue: number = 100;
  private readonly dataGeneratorInterval: number = 100;
  private dataGenerators$: Observable<number>[] = [];

  constructor() { }

  buildDataGenerators(howMany: number): Observable<number>[] {
    const newDataGenerators$: Observable<number>[] = [];

    for (let generatorIndex = 0; generatorIndex < howMany; generatorIndex++) {
      newDataGenerators$.push(
        interval(this.dataGeneratorInterval)
          .pipe(
            map(() => Math.random() * this.generatorMaxValue)
          )
      );
    }

    this.dataGenerators$ = newDataGenerators$;

    return this.dataGenerators$;
  }


}
