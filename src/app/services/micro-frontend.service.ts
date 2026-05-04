import { Injectable, Type } from '@angular/core';
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
  ): Promise<Type<unknown>> {
    try {
      const module = await this.loadModule(remoteName, exposedModule);
      const component = module[componentName] as Type<unknown> | undefined;

      if (!component) {
        throw new Error(`El componente ${componentName} no existe en ${exposedModule}`);
      }

      return component;
    } catch (error) {
      console.error(
        `Error cargando componente: ${componentName} desde ${remoteName}`,
        error
      );
      throw error;
    }
  }
}
