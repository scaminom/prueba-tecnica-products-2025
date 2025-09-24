import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import {
  PRODUCT_SERVICE,
  PRODUCT_REPOSITORY,
  PRODUCT_LIST_SERVICE,
  API_CONFIG,
} from './core/tokens/injection-tokens';
import { ProductService } from './features/product/services/product.service';
import { HttpProductRepository } from './features/product/services/http-product.repository';
import { ProductListService } from './features/product/services/product-list.service';
import { environment } from '../environments/environment.development';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor])),
    {
      provide: API_CONFIG,
      useValue: { baseUrl: environment.apiUrl },
    },
    {
      provide: PRODUCT_REPOSITORY,
      useClass: HttpProductRepository,
    },
    {
      provide: PRODUCT_SERVICE,
      useClass: ProductService,
    },
    {
      provide: PRODUCT_LIST_SERVICE,
      useClass: ProductListService,
    },
  ],
};
