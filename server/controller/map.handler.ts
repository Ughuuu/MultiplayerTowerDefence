import { Handler } from './handler';
import { Player } from '../model/player';
import { Unit } from '../model/unit';
import { Point } from '../model/point';
import { UnitBuilder } from '../builders/unit.builder';

export class MapHandler extends Handler {
    public templates: {} = {};
    public vectorField: {} = {};
    public distances: {} = {};
    public size: Point;
    public directions: Point[] = [new Point(-1, 0),
    new Point(-1, 1),
    new Point(0, 1),
    new Point(1, 1),
    new Point(1, 0),
    new Point(1, -1),
    new Point(0, -1),
    new Point(-1, -1)
    ];
    private static towerNumber: number = 1e+5;

    constructor(public template: number[][]) {
        super('MapHandler');
        this.size = new Point(this.template[0].length, this.template.length);
    }

    private static clearMap(matrix: number[][], w: number, h: number) {
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                matrix[y][x] = MapHandler.towerNumber;
            }
        }
    }

    private static initMap(w: number, h: number): number[][] {
        let matrix: number[][] = [];
        for (let y = 0; y < h; y++) {
            matrix[y] = [];
            for (let x = 0; x < w; x++) {
                matrix[y].push(0);
            }
        }
        return matrix;
    }

    private static copyMap(matrix: number[][], copy: number[][]) {
        for (let i = 0; i < copy.length; i++) {
            for (let j = 0; j < copy[i].length; j++) {
                matrix[i][j] = copy[i][j];
            }
        }
    }

    getCell(player: Player, pos: Point, unit: Unit) {
        let x = pos.x, y = pos.y;
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0) {
            x = 0;
        }
        if (x >= this.size.x) {
            x = this.size.x - 1;
        }
        if (y < 0) {
            y = 0;
        }
        if (y >= this.size.y) {
            y = this.size.y - 1;
        }
        let value = this.templates[player.id][y][x];
        if (value == MapHandler.towerNumber) {
            return { x: unit.lastCell.x, y: unit.lastCell.y };
        }
        let radius: number = UnitBuilder.types[unit.type].radius;
        if((pos.x%1 < radius || 1 - pos.x%1 < radius) && (pos.y%1 < radius || 1 - pos.y%1 < radius)){
            return { x: unit.lastCell.x, y: unit.lastCell.y };
        }
        unit.lastCell.x = x;
        unit.lastCell.y = y;
        return { x: x, y: y };
    }

    isDone(player: Player, pos: Point, unit: Unit) {
        let cell = this.getCell(player, pos, unit);
        if (cell.y == this.template.length - 1) {
            return true;
        }
        return false;
    }

    public getNext(player: Player, pos: Point, speed: number, unit: Unit, clock: number): Point {
        let cell = this.getCell(player, pos, unit);
        let value = this.templates[player.id][cell.y][cell.x];
        if (value == MapHandler.towerNumber) {
            value = 0;
        }
        let dir = this.directions[this.vectorField[player.id][cell.y][cell.x]];
        let extraDir = new Point(0, 0);
        let radius = UnitBuilder.types[unit.type].radius;
        if((pos.x%1 < radius || 1 - pos.x%1 < radius) && (pos.y%1 < radius || 1 - pos.y%1 < radius)){
            if(unit.stuck != null && unit.stuck == 0){
                unit.stuck = clock;
            }
            if(clock - unit.stuck < 1000){
                return { x: (dir.x + extraDir.x) * speed / (value + 1), y: (dir.y + extraDir.y) * speed / (value + 1) };
            }
            // return to the cell you belong to
            extraDir.x=(-pos.x + cell.x);
            extraDir.y=(-pos.y + cell.y);
            return { x: (extraDir.x) * speed / (value + 1), y: (extraDir.y) * speed / (value + 1) };
        }else{
            unit.stuck = 0;
        }
        return { x: (dir.x + extraDir.x) * speed / (value + 1), y: (dir.y + extraDir.y) * speed / (value + 1) };
    }

    computeDistances(player: Player) {
        let vectorField = this.vectorField[player.id];
        let template = this.templates[player.id];
        let distance = MapHandler.initMap(this.size.x, this.size.y);
        MapHandler.clearMap(distance, this.template[0].length, this.template.length);
        var toVisit = [[Math.round(this.size.x / 2), this.size.y - 1]]; // Initialise at the start square
        distance[toVisit[0][1]][toVisit[0][0]] = 0;
        while (toVisit.length) { // While there are still squares to visit
            let x = toVisit[0][0];
            let y = toVisit[0][1];
            this.neighbourCheck(distance, template, x, y, x + 1, y, toVisit);
            this.neighbourCheck(distance, template, x, y, x - 1, y, toVisit);
            this.neighbourCheck(distance, template, x, y, x, y + 1, toVisit);
            this.neighbourCheck(distance, template, x, y, x, y - 1, toVisit);
            var shift = toVisit.shift();
        }
        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {
                let dirs: {} = {};
                for (let i = 0; i < this.directions.length; i++) {
                    let dirx: number = this.directions[i].x;
                    let diry: number = this.directions[i].y;
                    if (x + dirx >= 0 && x + dirx < this.size.x &&
                        y + diry >= 0 && y + diry < this.size.y) {
                        if (Math.abs(diry) == Math.abs(dirx)) {
                            dirs[i] = distance[y + diry][x]/3 + distance[y][x + dirx]/3 + distance[y + diry][x + dirx]/3 ;
                        }
                        else {
                            dirs[i] = distance[y + diry][x + dirx];
                        }
                    }
                }
                let dir: number = 0;
                let min: number = Number.MAX_SAFE_INTEGER;
                for (let i = 0; i < this.directions.length; i++) {
                    if (dirs[i] && min > dirs[i]) {
                        dir = i;
                        min = dirs[i];
                    }
                }
                vectorField[y][x] = dir;
            }
        }
        this.distances[player.id] = MapHandler.initMap(this.size.x, this.size.y);
        MapHandler.copyMap(this.distances[player.id], distance);
    }

    private neighbourCheck(matrix: number[][], template: number[][], x: number, y: number, toX: number, toY: number, toVisit: number[][]) {
        if (toX < this.size.x
            && toX > -1
            && toY < this.size.y
            && toY > -1
            && matrix[y][x] + template[toY][toX] + 1 < matrix[toY][toX]) {
            matrix[toY][toX] = matrix[y][x] + template[toY][toX] + 1;
            toVisit.push([toX, toY]);
        }
    }

    onJoin(player: Player) {
        this.templates[player.id] = MapHandler.initMap(this.size.x, this.size.y);
        MapHandler.copyMap(this.templates[player.id], this.template);
        this.vectorField[player.id] = MapHandler.initMap(this.size.x, this.size.y);
        this.computeDistances(player);
    }

    onLeave(player: Player) {
        delete this.templates[player.id];
        delete this.vectorField[player.id];
    }

    addTower(player: Player, position: Point, size: number) {
        let start = Math.round(size / 2);
        position.x = Math.floor(position.x);
        position.y = Math.floor(position.y);
        for (let i = 0; i < start; i++) {
            for (let j = 0; j < start; j++) {
                if (position.y + i < 0 || position.y + i >= this.size.y || position.x + i < 0 || position.x + i >= this.size.x) {
                    continue;
                }
                this.templates[player.id][position.y + i][position.x + j] = MapHandler.towerNumber;
            }
        }
        this.computeDistances(player);
    }

    clearTower(player: Player, position: Point, size: number) {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                this.templates[player.id][position.y + i][position.x + j] = this.template[position.y + i][position.x + j];
            }
        }
    }

    update(players) {
    }

    toJSON(): any {
        return { maps: this.distances };
    }
}