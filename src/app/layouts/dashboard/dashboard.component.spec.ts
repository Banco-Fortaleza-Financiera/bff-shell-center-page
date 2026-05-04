import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { MicroFrontendService } from '../../services/micro-frontend.service';

describe('DashboardComponent', () => {
    const microFrontendServiceMock = {
        loadComponent: jest.fn(),
    };

    beforeEach(async () => {
        microFrontendServiceMock.loadComponent.mockReset();
        microFrontendServiceMock.loadComponent.mockResolvedValue(class RemoteComponent {});

        await TestBed.configureTestingModule({
            imports: [DashboardComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        data: of({
                            mfConfig: {
                                name: 'remote-app',
                                exposedModule: './Module',
                                componentName: 'RemoteComponent',
                            },
                        }),
                    },
                },
                {
                    provide: MicroFrontendService,
                    useValue: microFrontendServiceMock,
                },
            ],
        }).compileComponents();
    });

    it('should create and load the configured remote component', async () => {
        const fixture = TestBed.createComponent(DashboardComponent);

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
});
