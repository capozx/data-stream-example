import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.sass']
})
export class GraphComponent implements OnInit, OnChanges {
  chart: any;

  @Input()
  data: any[] = [];

  // xBuffer for X axis, allowed values [0, +Inf)
  xBuffer: number = 0.1;

  ngOnInit(): void {
    this.chart = new Chart("chart-element", {
      type: 'line',
      data: {
        labels: [
          "Gen", "Feb", "Mar", "Apr", "May", "Jun", "Jul"
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            min: 0
          }
        }
      }
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes) {
      const pairedData: [] = changes['data'].currentValue;
      this.updateGraphData(Object.keys(pairedData), Object.values(pairedData))
    } 
  }

  updateGraphData(labels: string[], data: string[]): void {
    const maxLabelValue: number = parseInt(labels[labels.length - 1]);
    
    if (this.chart) {

      if (this.chart.data) {
        this.chart.data.labels = labels;

        if (this.chart.data.datasets && this.chart.data.datasets[0]) {
          this.chart.data.datasets[0].data = data;
        } else {
          console.warn("unable to update graph data: chart dataset is not ready");
        }

        
      } else {
        console.warn("unable to update graph data: chart data is not ready");
      }

      this.chart.options.scales.x.max = Math.floor(maxLabelValue * (1 + this.xBuffer));
      this.chart.update();
    } else {
      console.warn("unable to update graph data: chart is not ready");
    }
    
  }

}
