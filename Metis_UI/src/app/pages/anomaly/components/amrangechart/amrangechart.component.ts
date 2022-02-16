import { Component, OnInit, Inject, NgZone, PLATFORM_ID, OnDestroy, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';



@Component({
    selector: 'app-amrangechart',
    templateUrl: './amrangechart.component.html',
    styleUrls: ['./amrangechart.component.css']
})
export class AmrangechartComponent implements OnInit, OnDestroy, AfterViewInit {

    private chart: am4charts.XYChart;

    constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone) { }

    // Run the function only in the browser
    browserOnly(f: () => void) {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                f();
            });
        }
    }

    ngAfterViewInit() {
        // Chart code goes in here
        this.browserOnly(() => {
            // Themes end
            am4core.options.autoDispose = true;
            // Create chart instance
            this.chart = am4core.create('chartdivs', am4charts.XYChart);

            // Add data
            this.chart.data = [{
                year: '1950',
                value: -0.307
            }, {
                year: '1951',
                value: -0.168
            }, {
                year: '1952',
                value: -0.073
            }, {
                year: '1953',
                value: -0.027
            }, {
                year: '1954',
                value: -0.251
            }, {
                year: '1955',
                value: -0.281
            }, {
                year: '1956',
                value: -0.348
            }, {
                year: '1957',
                value: -0.074
            }, {
                year: '1958',
                value: -0.011
            }, {
                year: '1959',
                value: -0.074
            }, {
                year: '1960',
                value: -0.124
            }, {
                year: '1961',
                value: -0.024
            }, {
                year: '1962',
                value: -0.022
            }, {
                year: '1963',
                value: 0
            }, {
                year: '1964',
                value: -0.296
            }, {
                year: '1965',
                value: -0.217
            }, {
                year: '1966',
                value: -0.147
            }, {
                year: '1967'
            }, {
                year: '1971',
                value: -0.19
            }, {
                year: '1972',
                value: -0.056
            }, {
                year: '1973',
                value: 0.077
            }, {
                year: '1974',
                value: -0.213
            }, {
                year: '1975',
                value: -0.17
            }, {
                year: '1976',
                value: -0.254
            }, {
                year: '1977',
                value: 0.019
            }, {
                year: '1978',
                value: -0.063
            }, {
                year: '1979',
                value: 0.05
            }, {
                year: '1980',
                value: 0.077
            }, {
                year: '1981',
                value: 0.12
            }, {
                year: '1982',
                value: 0.011
            }, {
                year: '1983',
                value: 0.177
            }, {
                year: '1984'
            }, {
                year: '1989',
                value: 0.104
            }, {
                year: '1990',
                value: 0.255
            }, {
                year: '1991',
                value: 0.21
            }, {
                year: '1992',
                value: 0.065
            }, {
                year: '1993',
                value: 0.11
            }, {
                year: '1994',
                value: 0.172
            }, {
                year: '1995',
                value: 0.269
            }, {
                year: '1996',
                value: 0.141
            }, {
                year: '1997',
                value: 0.353
            }, {
                year: '1998',
                value: 0.548
            }, {
                year: '1999',
                value: 0.298
            }, {
                year: '2000',
                value: 0.267
            }, {
                year: '2001',
                value: 0.411
            }, {
                year: '2002',
                value: 0.462
            }, {
                year: '2003',
                value: 0.47
            }, {
                year: '2004',
                value: 0.445
            }, {
                year: '2005',
                value: 0.47
            }];

            // Create axes
            // tslint:disable-next-line:prefer-const
            let dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.grid.template.disabled = true;
            dateAxis.renderer.minGridDistance = 50;
            dateAxis.renderer.grid.template.location = 0.5;
            dateAxis.baseInterval = {
                count: 1,
                timeUnit: 'year'
            };

            const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.renderer.grid.template.disabled = true;
            // Create series
            // tslint:disable-next-line:prefer-const
            let series = this.chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = 'value';
            series.dataFields.dateX = 'year';
            series.strokeWidth = 3;
            series.connect = false;
            series.tensionX = 0.8;
            series.fillOpacity = 0.2;
            // tslint:disable-next-line:prefer-const
            let bullet = series.bullets.push(new am4charts.CircleBullet());
            bullet.stroke = new am4core.InterfaceColorSet().getFor('background');
            bullet.strokeWidth = 2;
            bullet.tooltipText = '{valueY}';
            bullet.circle.radius = 4;

            bullet.adapter.add('fill', function(fill, target) {
                // if(target.dataItem.valueY > 0){
                //     return this.chart.colors.getIndex(2);
                // }
                return fill;
            });

            // tslint:disable-next-line:prefer-const
            let range = valueAxis.createSeriesRange(series);
            range.value = 0;
            range.endValue = 100;
            range.contents.stroke = this.chart.colors.getIndex(2);
            range.contents.fill = range.contents.stroke;
            range.contents.fillOpacity = 0.2;

            // this.chart.scrollbarX = new am4core.Scrollbar();
            // this.chart.cursor = new am4charts.XYCursor();
            this.chart.cursor = new am4charts.XYCursor();
            this.chart.cursor.behavior = 'zoomXY';
            this.chart.cursor.snapToSeries = series.data;
            // this.chart.cursor.yAxis = heatLegend.valueAxis;
            this.chart.cursor.fullWidthLineY = true;
            this.chart.cursor.lineY.strokeWidth = 0;
            this.chart.cursor.lineY.fill = am4core.color('#8F3985');
            this.chart.cursor.lineY.fillOpacity = 0.1;
            this.chart.cursor.lineX.strokeWidth = 0;
            this.chart.cursor.lineX.fill = am4core.color('#8F3985');
            this.chart.cursor.lineX.fillOpacity = 0.1;
    // this.chart.cursor.lineX.disabled = true;
        });
    }

    ngOnDestroy() {
        // Clean up chart when the component is removed
        // am4core.options.autoDispose = true;
        // chart: am4charts.XYChart;
        if (this.chart) {
            // am4charts.XYChart[0]._disposed = true;
            this.chart.dispose();
        }
    }
    // maybeDisposeChart() {
    //     if (this.chart['chartdivs']) {
    //         this.chart['chartdivs'].dispose();
    //         delete this.chart['chartdivs'];
    //     }
    // }
    ngOnInit() {

    }
}


