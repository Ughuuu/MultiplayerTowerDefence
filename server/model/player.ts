import { Tower } from './tower';
import { Unit } from './unit';
import { Point } from './point';

export class Player {
    tower_ids: number[] = [];
    unit_ids: number[] = [];
    creep_location: number = 0;
    walls = [];

    constructor(public id: number, public name: string, public location: number) { }
}