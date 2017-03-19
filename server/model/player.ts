import { Tower } from './tower';
import { Unit } from './unit';

export class Player {
    tower_ids= [];
    unit_ids= [];

    constructor(public id: number, public name: string) { }
}