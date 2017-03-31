import { Handler } from './handler';
import { GameRoom } from '../rooms/game.room';

export class MoneyHandler extends Handler {
    money: {} = {};
    time: number = 0;
    playerIncome: {} = {};
    static goldInterval: number = 5000;

    constructor() {
        super('MoneyHandler');
    }

    onJoin(player) {
        this.money[player.id] = 100;
        this.playerIncome[player.id] = 1;
    }

    onLeave(player) {
        delete this.money[player.id];
        delete this.playerIncome[player.id];
    }

    bounty(player, price: number, gameRoom: GameRoom) {
        this.money[player.id] += price;
        this.send(player, gameRoom);
    }

    send(player, gameRoom: GameRoom) {
        gameRoom.send(player.client, { money: this.money[player.id].toFixed(3), income: this.playerIncome[player.id].toFixed(3) });
    }

    sell(player, price, gameRoom: GameRoom) {
        this.money[player.id] += price / 2;
        this.send(player, gameRoom);
    }

    hasGold(player, price) {
        return this.money[player.id] > price;
    }

    buy(player, price, gameRoom: GameRoom) {
        this.money[player.id] -= price;
        this.send(player, gameRoom);
    }

    spawn(player, price, income, gameRoom: GameRoom) {
        this.playerIncome[player.id] += income;
        this.money[player.id] -= price;
        this.send(player, gameRoom);
    }

    update(players, gameRoom: GameRoom, handlers, builders) {
        this.time += gameRoom.clock.deltaTime;
        if (this.time > MoneyHandler.goldInterval) {
            this.time = 0;
            for (let id in this.money) {
                this.money[id] += this.playerIncome[id];
                this.send(players[id], gameRoom);
            }
        }
    }

    toJSON(players, handlers, builders) {
        return {};
    }
}
