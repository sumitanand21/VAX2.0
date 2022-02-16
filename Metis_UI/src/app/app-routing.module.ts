import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FEATURES, SOCKET_FEATURE } from 'src/config/app.cofig';
import { FeatureGuard } from './guards/feature-guard.service';

const routes: Routes = [
  {
    path: 'forecast',
    loadChildren: () => import('./pages/forecast/forecast.module').then(m => m.ForecastModule),
    canLoad: [FeatureGuard],
    data: {
      feature: FEATURES.FORECAST,
      socket: SOCKET_FEATURE.FORECAST
    },
  },
  {
    path: 'anomaly',
    loadChildren: () => import('./pages/anomaly/anomaly.module').then(m => m.AnomalyModule),
    canLoad: [FeatureGuard],
    data: {
      feature: FEATURES.ANOMALY,
      socket: SOCKET_FEATURE.ANOMALY
    },
  },
  {
    path: 'correlation',
    loadChildren: () => import('./pages/correlation/correlation.module').then(m => m.CorrelationModule),
    canLoad: [FeatureGuard],
    data: {
      feature: FEATURES.CORRELATION,
      socket: SOCKET_FEATURE.CORRELATION
    },
  },
  {
    path: 'classification',
    loadChildren: () => import('./pages/classification/classification.module').then(m => m.ClassificationModule),
    canLoad: [FeatureGuard],
    data: {
      feature: FEATURES.CLASSIFICATION,
      socket: SOCKET_FEATURE.CLASSIFICATION
    },
  },
  {
    path: 'datamanagement',
    loadChildren: () => import('./pages/data-management/data-management.module').then(m => m.DataManagementModule),
    canLoad: [FeatureGuard],
    data: {
      feature: FEATURES.DATAMANAGEMENT,
      socket: SOCKET_FEATURE.DATAMANAGEMENT
    }
  },
  {
    path: 'summary',
    loadChildren: () => import('./pages/summary/summary.module').then(m => m.SummaryModule),
    canLoad: [FeatureGuard],
    data: {
      feature: FEATURES.SUMMARY,
      socket: SOCKET_FEATURE.SUMMARY
    }
  },
  { path: '**', redirectTo: 'summary', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
