import { Tower } from './tower';
import { Unit } from './unit';
import { Point } from './point';

export class Player {
    tower_ids= [];
    unit_ids= [];
    creep_location: number = 0;

    constructor(public id: number, public name: string, public location: number) { }
}