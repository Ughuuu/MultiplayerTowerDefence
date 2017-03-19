import { Handler } from './handler';
import { Player } from '../model/player';
var PF = require('pathfinding');
export class MapHandler extends Handler {
    map: any;
    constructor(matrix) {
        super('MapHandler');
        this.map = new PF.Grid(matrix); 
        
    }
    onJoin(player: Player) {
    }

    onLeave(player: Player) {
    }

    onMessage(player: Player, data: any) {
        // TO DO
    }

    update(players) {
    }

    GetPath(x1, y1, x2, y2) {
        var finder = new PF.AStarFinder({
            allowDiagonal: true,
            dontCrossCorners: true
        });
        return finder.findPath(x1, y1, x2, y2, this.map);  
    }

    setWalkable(x, y, isWalkable) {
        this.map.setWalkableAt(x, y, isWalkable);
    }

    toJSON(): any {
        return {};
    }
}