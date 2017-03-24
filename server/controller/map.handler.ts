import { Handler } from './handler';
import { Player } from '../model/player';
import { Point } from '../model/point';
var PF = require('pathfinding');

export class MapHandler extends Handler {
    public templates: {} = {};
    public vectorField: {} = {};
    public size: Point;
    public directions: Point[] = [new Point(-1, 0), 
        new Point(-1, 1), 
        new Point(0, 1), 
        new Point(1, 1), 
        new Point(1, 0),
        new Point(1, -1),
        new Point(0, -1),
        new Point(-1, -1)];

    constructor(public template) {
        super('MapHandler');
        this.size = new Point(this.template[0].length, this.template.length);
    }

    private static clearMap(matrix: number[][], w: number, h: number) {
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                matrix[y][x] = Number.MAX_SAFE_INTEGER;
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

    public getNext(player: Player, pos: Point): Point {
        let x = pos.x, y = pos.y;
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
        x = Math.floor(x);
        y = Math.floor(y);
        return this.directions[this.vectorField[player.id][y][x]];
    }

    computeDistances(player: Player) {
        let vectorField = this.vectorField[player.id];
        let template = this.templates[player.id];
        let distance = MapHandler.initMap(this.size.x, this.size.y);
        MapHandler.clearMap(distance, this.template[0].length, this.template.length);
        var toVisit = [[Math.floor(this.size.x / 2), this.size.y - 1]]; // Initialise at the start square
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
                for(let i=0;i<this.directions.length;i++){
                    if (x + this.directions[i].x >= 0 && x + this.directions[i].x < this.size.x &&
                    y + this.directions[i].y >= 0 && y + this.directions[i].y < this.size.y) {
                        dirs[i] = distance[y + this.directions[i].y][x + this.directions[i].x];
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
        let start = Math.floor(size / 2);
        for (let i = 0; i <= start; i++) {
            for (let j = 0; j <= start; j++) {
                if (position.y + i < 0 || position.y + i >= this.size.y || position.x + i < 0 || position.x + i >= this.size.x) {
                    continue;
                }
                this.templates[player.id][position.y + i][position.x + j] = Number.MAX_SAFE_INTEGER;
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
        return { map: this.template };
    }
}