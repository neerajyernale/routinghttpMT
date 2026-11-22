import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { LoaderService } from "../services/loader.service";
import { Observable } from "rxjs";
import { finalize, retry } from "rxjs/operators";
import { Injectable } from "@angular/core";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor{
    constructor(private loaderservice: LoaderService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loaderservice.show();
        return next.handle(req).pipe(
            finalize(() => this.loaderservice.hide())
        );
    }
}

