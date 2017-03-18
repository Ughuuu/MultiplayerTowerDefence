import { Player } from '../model/player';

export abstract class Handler  {
    onJoin(player: Player){}
    onLeave(player: Player){}
    onMessage(player: Player, data){}
    onDispose(players){}    
    update(players){}

    abstract toJSON() : any;
}