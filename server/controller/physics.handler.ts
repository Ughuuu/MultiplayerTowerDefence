import { Handler } from './handler';
import { GameRoom } from '../rooms/game.room';
import { Player } from '../model/player';
const b2 = require ( 'lucy-b2' );
        
export class PhysicsHandler extends Handler {
    private static gravity = new b2.Vec2  ( 0, -9.8 );
    private world;

    constructor() {
        super();
        this.world  = new b2.World ( PhysicsHandler.gravity );
    }

    onJoin(player: Player){
    }

    onLeave(player: Player){
        for(let unit of player.units){
            unit.destroyBody(this.world);
        }
    }

    onMessage(player: Player, data: any){
        // TO DO
    }

    update(players){
        this.world.Step ( GameRoom.ms, 10, 10 );
    }

    toJSON(): any {
        return {};
    }

    onDispose(players){
        for(let player of players){
            for(let unit of player.units){
                unit.destroyBody(this.world);
            }
        }
    }
}