import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, UrlSegment, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SessionService } from '../auth/session.service';
import { SESSION } from '../constants/app.constants';
@Injectable({ providedIn: 'root' })
export class FeatureGuard implements CanActivate, CanLoad {
    constructor(
        private router: Router,
        private sessionStorage: SessionService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        this.sessionStorage.setKeyValue(SESSION.FEATURE, route.data.socket);
        if (!route.data.feature) {
            this.router.navigate(['/forecast']);
        } else {
            return true;
        }
    }
    canLoad(
        route: Route,
        segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        this.sessionStorage.setKeyValue(SESSION.FEATURE, route.data.socket);
        if (!route.data.feature) {
            this.router.navigate(['/forecast']);
        } else {
            return true;
        }
    }
}
