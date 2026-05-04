import {
    Component,
    OnInit,
    Type,
    signal,
    inject,
    DestroyRef,
} from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MicroFrontendConfig } from '../../interfaces/micro-frontend-config.interface';
import { MicroFrontendService } from '../../services/micro-frontend.service';

/**
 * Componente host dinámico que carga y renderiza micro frontends remotos
 * Funciona como contenedor dinámico para componentes cargados en tiempo de ejecución
 */
@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, NgComponentOutlet],
    templateUrl: `./dashboard.component.html`,
    styleUrls: [`./dashboard.component.scss`],
})
export class DashboardComponent implements OnInit {

    mfService: MicroFrontendService = inject(MicroFrontendService);
    route: ActivatedRoute = inject(ActivatedRoute);
    destroyRef: DestroyRef = inject(DestroyRef);
    component = signal<Type<any> | null>(null);
    loading = signal(true);
    error = signal<string | null>(null);
    private currentLoadId = 0;


    ngOnInit() {
        this.route.data
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => {
                const mfConfig = data['mfConfig'] as MicroFrontendConfig | undefined;

                void this.loadRemoteComponent(mfConfig);
            });
    }

    private async loadRemoteComponent(mfConfig?: MicroFrontendConfig) {
        const loadId = ++this.currentLoadId;

        try {
            this.loading.set(true);
            this.error.set(null);
            this.component.set(null);

            // Obtener parámetros de la ruta
            if (!mfConfig) {
                throw new Error('Configuración de micro frontend no encontrada');
            }

            if (!mfConfig.componentName) {
                throw new Error('Nombre de componente remoto no encontrado');
            }

            const RemoteComponent = await this.loadComponentWithFallback(mfConfig);

            if (loadId !== this.currentLoadId) {
                return;
            }

            this.component.set(RemoteComponent);
        } catch (err) {
            if (loadId !== this.currentLoadId) {
                return;
            }

            const errorMessage = err instanceof Error ? err.message : String(err);
            this.error.set(errorMessage);
            console.error('Error en MicroFrontendHostComponent:', err);
        } finally {
            if (loadId === this.currentLoadId) {
                this.loading.set(false);
            }
        }
    }

    private async loadComponentWithFallback(mfConfig: MicroFrontendConfig) {
        try {
            return await this.mfService.loadComponent(
                mfConfig.name,
                mfConfig.exposedModule,
                mfConfig.componentName
            );
        } catch (error) {
            if (!mfConfig.fallbackExposedModule) {
                throw error;
            }

            return this.mfService.loadComponent(
                mfConfig.name,
                mfConfig.fallbackExposedModule,
                mfConfig.componentName
            );
        }
    }
}
