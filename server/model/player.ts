import { Tower } from './tower';
import { Unit } from './unit';
import { Point } from './point';
import { Client } from "colyseus";
import { UnitBuilder } from '../builders/unit.builder';
import { TowerBuilder } from '../builders/tower.builder';

export class Player {
    tower_ids: number[] = [];
    unit_ids: number[] = [];
    creep_location: number = 0;
    walls = [];
    life: number = 30;
    lastSend: number = 0;

    constructor(public id: number, public client: Client, public name: string, public location: number) { }
}