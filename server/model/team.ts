import { Player } from './player';

export class Team {
    players: Player[] = [];

    constructor(public id: number) { }
}