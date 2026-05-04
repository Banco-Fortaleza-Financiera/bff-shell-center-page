// Shell Module para la arquitectura de micro frontend
// Este módulo exporta la configuración y componentes principales de la shell

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { App } from './app';

@NgModule({
  imports: [CommonModule, RouterModule, App],
  exports: [App],
})
export class ShellModule {}
