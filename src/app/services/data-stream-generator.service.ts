import { Injectable } from '@angular/core';
import {interval, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataStreamGeneratorService {

  private generatorCurrentValue: number = 1000;
  private readonly maxPercentageVariation: number = 0.025;
  private readonly dataGeneratorInterval: number = 100;
  private dataGenerators$: Observable<number>[] = [];

  constructor() { }

  buildDataGenerators(howMany: number): Observable<number>[] {
    const newDataGenerators$: Observable<number>[] = [];

    for (let generatorIndex = 0; generatorIndex < howMany; generatorIndex++) {
      newDataGenerators$.push(
        interval(this.dataGeneratorInterval)
          .pipe(
            map(() => {
              this.generatorCurrentValue = this.generatorCurrentValue + 
                (this.generatorCurrentValue * this.maxPercentageVariation * this.generateSign());
              return this.generatorCurrentValue;
            })
          )
      );
    }

    this.dataGenerators$ = newDataGenerators$;

    return this.dataGenerators$;
  }

  private generateSign(): number {
    return (Math.random() >= 0.5) ? 1 : -1;
  }


}
