import { Tower } from './tower';
import { Unit } from './unit';
import { Point } from './point';
import { Client } from "colyseus";

export class Player {
    tower_ids: number[] = [];
    unit_ids: number[] = [];
    creep_location: number = 0;
    walls = [];

    constructor(public id: number, public client: Client, public name: string, public location: number) { }
}