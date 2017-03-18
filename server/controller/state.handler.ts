export class StateHandler  {
    message: string[];
    constructor() {
        this.message = [];

        setInterval(this.update.bind(this), 1000 / 20)
    }
    onJoin(client) {
      
    }

    onLeave(client) {
      
    }
    onMessage(client, data) {
        this.message.push(data.message);
    }

    update(){
        console.log("Update");
    }

    toJSON() {
        return {
            messages: this.message
        };
    }
}