import { Injectable } from '@angular/core';
import {interval, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataStreamGeneratorService {

  private readonly generatorInitialValue: number = 1000;
  private generatorCurrentValue: number = this.generatorInitialValue;
  private generatorMinValue: number = this.generatorInitialValue / 2;
  private generatorMaxValue: number = this.generatorInitialValue * 2;

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
    let sign: number = (Math.random() >= 0.5) ? 1 : -1;

    if (this.generatorCurrentValue > this.generatorMaxValue) {
      sign = -1;
    } else if (this.generatorCurrentValue < this.generatorMinValue) {
      sign = 1;
    }

    return sign;
  }


}
