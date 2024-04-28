import {Component, OnInit} from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.sass']
})
export class GraphComponent implements OnInit {
  chart: any;

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
      }
    });

  }

}
