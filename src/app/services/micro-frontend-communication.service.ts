import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { MicroFrontendEvent } from '../interfaces/micro-frontend-event.interface';

@Injectable({
  providedIn: 'root',
})
export class MicroFrontendCommunicationService {
  private eventSubject = new Subject<MicroFrontendEvent>();

  /**
   * Observable de eventos entre micro frontends
   */
  public events$: Observable<MicroFrontendEvent> =
    this.eventSubject.asObservable();

  /**
   * Emitir un evento desde un micro frontend
   * @param event - Evento a emitir
   */
  emit(event: MicroFrontendEvent): void {
    this.eventSubject.next(event);
  }

  /**
   * Emitir un evento de usuario
   * @param data - Datos del usuario
   */
  emitUserEvent(data: any): void {
    this.emit({
      type: 'user',
      data,
    });
  }

  /**
   * Emitir un evento de notificación
   * @param message - Mensaje de notificación
   * @param type - Tipo de notificación (success, error, warning, info)
   */
  emitNotification(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info'
  ): void {
    this.emit({
      type: 'notification',
      data: { message, notificationType: type },
    });
  }

  /**
   * Escuchar eventos de un tipo específico
   * @param eventType - Tipo de evento a escuchar
   */
  onEvent(eventType: string): Observable<MicroFrontendEvent> {
    return new Observable((observer) => {
      this.events$.subscribe((event) => {
        if (event.type === eventType) {
          observer.next(event);
        }
      });
    });
  }
}
