import { TestBed } from '@angular/core/testing';
import { MicroFrontendCommunicationService } from './micro-frontend-communication.service';
import { MicroFrontendEvent } from '../interfaces/micro-frontend-event.interface';

describe('MicroFrontendCommunicationService', () => {
  let service: MicroFrontendCommunicationService;
  let receivedEvents: MicroFrontendEvent[];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MicroFrontendCommunicationService);
    receivedEvents = [];
  });

  it('should emit events through the events stream', () => {
    const event: MicroFrontendEvent = {
      type: 'custom',
      data: { id: 1 },
      source: 'shell',
    };

    service.events$.subscribe((receivedEvent) => {
      receivedEvents.push(receivedEvent);
    });

    service.emit(event);

    expect(receivedEvents).toEqual([event]);
  });

  it('should emit user events', () => {
    const userData = { username: 'tester' };

    service.events$.subscribe((receivedEvent) => {
      receivedEvents.push(receivedEvent);
    });

    service.emitUserEvent(userData);

    expect(receivedEvents).toEqual([
      {
        type: 'user',
        data: userData,
      },
    ]);
  });

  it('should emit notification events with info as the default type', () => {
    service.events$.subscribe((receivedEvent) => {
      receivedEvents.push(receivedEvent);
    });

    service.emitNotification('Operación completada');

    expect(receivedEvents).toEqual([
      {
        type: 'notification',
        data: {
          message: 'Operación completada',
          notificationType: 'info',
        },
      },
    ]);
  });

  it('should filter events by type', () => {
    service.onEvent('notification').subscribe((receivedEvent) => {
      receivedEvents.push(receivedEvent);
    });

    service.emitUserEvent({ username: 'tester' });
    service.emitNotification('Operación completada', 'success');

    expect(receivedEvents).toEqual([
      {
        type: 'notification',
        data: {
          message: 'Operación completada',
          notificationType: 'success',
        },
      },
    ]);
  });
});
