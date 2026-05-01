import { Injectable } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation-runtime/enhanced';

@Injectable({
  providedIn: 'root',
})
export class MicroFrontendService {
  async loadModule(remoteName: string, exposedModule: string) {
    try {
      return await loadRemoteModule({
        remoteName,
        exposedModule,
      });
    } catch (error) {
      console.error(
        `Error cargando modulo remoto: ${exposedModule} desde ${remoteName}`,
        error
      );
      throw error;
    }
  }

  async loadComponent(
    remoteName: string,
    exposedModule: string,
    componentName: string
  ) {
    try {
      const module = await this.loadModule(remoteName, exposedModule);
      return module[componentName];
    } catch (error) {
      console.error(
        `Error cargando componente: ${componentName} desde ${remoteName}`,
        error
      );
      throw error;
    }
  }
}
