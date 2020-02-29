export * from './car.service';
import { CarService } from './car.service';
export * from './customer.service';
import { CustomerService } from './customer.service';
export * from './place.service';
import { PlaceService } from './place.service';
export * from './reservation.service';
import { ReservationService } from './reservation.service';
export const APIS = [CarService, CustomerService, PlaceService, ReservationService];
