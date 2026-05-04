import {
    Component,
    ViewContainerRef,
    OnInit,
    Type,
    signal,
    inject,
} from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
    viewContainer: ViewContainerRef = inject(ViewContainerRef);
    component = signal<Type<any> | null>(null);
    loading = signal(true);
    error = signal<string | null>(null);


    ngOnInit() {
        this.loadRemoteComponent();
    }

    private async loadRemoteComponent() {
        try {
            this.loading.set(true);
            this.error.set(null);

            // Obtener parámetros de la ruta
            const mfConfig = this.route.snapshot.data['mfConfig'] as MicroFrontendConfig | undefined;

            if (!mfConfig) {
                throw new Error('Configuración de micro frontend no encontrada');
            }

            if (!mfConfig.componentName) {
                throw new Error('Nombre de componente remoto no encontrado');
            }

            const RemoteComponent = await this.loadComponentWithFallback(mfConfig);

            this.component.set(RemoteComponent);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            this.error.set(errorMessage);
            console.error('Error en MicroFrontendHostComponent:', err);
        } finally {
            this.loading.set(false);
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
