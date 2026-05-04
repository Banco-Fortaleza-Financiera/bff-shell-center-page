import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { MicroFrontendService } from '../../services/micro-frontend.service';
import { MicroFrontendConfig } from '../../interfaces/micro-frontend-config.interface';

describe('DashboardComponent', () => {
    let routeData: ReplaySubject<Record<string, MicroFrontendConfig | undefined>>;

    const microFrontendServiceMock = {
        loadComponent: jest.fn(),
    };

    beforeEach(async () => {
        routeData = new ReplaySubject<Record<string, MicroFrontendConfig | undefined>>(1);
        microFrontendServiceMock.loadComponent.mockReset();
        microFrontendServiceMock.loadComponent.mockResolvedValue(class RemoteComponent {});
        jest.spyOn(console, 'error').mockImplementation(() => undefined);

        await TestBed.configureTestingModule({
            imports: [DashboardComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        data: routeData.asObservable(),
                    },
                },
                {
                    provide: MicroFrontendService,
                    useValue: microFrontendServiceMock,
                },
            ],
        }).compileComponents();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should create and load the configured remote component', async () => {
        const fixture = TestBed.createComponent(DashboardComponent);

        routeData.next({
            mfConfig: {
                name: 'remote-app',
                displayName: 'Remote App',
                remoteEntry: 'http://localhost/remoteEntry.js',
                exposedModule: './Module',
                componentName: 'RemoteComponent',
                path: 'users',
            },
        });
        fixture.detectChanges();
        await fixture.whenStable();

        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
        expect(component.loading()).toBe(false);
        expect(component.error()).toBeNull();
        expect(microFrontendServiceMock.loadComponent).toHaveBeenCalledWith(
            'remote-app',
            './Module',
            'RemoteComponent'
        );
    });

    it('should show an error when route data has no config', async () => {
        const fixture = TestBed.createComponent(DashboardComponent);

        routeData.next({ mfConfig: undefined });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.componentInstance.loading()).toBe(false);
        expect(fixture.componentInstance.error()).toBe(
            'Configuración de micro frontend no encontrada'
        );
    });

    it('should show an error when the config has no component name', async () => {
        const fixture = TestBed.createComponent(DashboardComponent);

        routeData.next({
            mfConfig: {
                name: 'remote-app',
                displayName: 'Remote App',
                remoteEntry: 'http://localhost/remoteEntry.js',
                exposedModule: './Module',
                componentName: '',
                path: 'users',
            },
        });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.componentInstance.error()).toBe(
            'Nombre de componente remoto no encontrado'
        );
    });

    it('should load the fallback module when the main module fails', async () => {
        const fixture = TestBed.createComponent(DashboardComponent);
        class FallbackComponent {}
        microFrontendServiceMock.loadComponent
            .mockRejectedValueOnce(new Error('main module failed'))
            .mockResolvedValueOnce(FallbackComponent);

        routeData.next({
            mfConfig: {
                name: 'remote-app',
                displayName: 'Remote App',
                remoteEntry: 'http://localhost/remoteEntry.js',
                exposedModule: './Module',
                fallbackExposedModule: './FallbackModule',
                componentName: 'RemoteComponent',
                path: 'users',
            },
        });
        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.componentInstance.component()).toBe(FallbackComponent);
        expect(microFrontendServiceMock.loadComponent).toHaveBeenLastCalledWith(
            'remote-app',
            './FallbackModule',
            'RemoteComponent'
        );
    });
});
