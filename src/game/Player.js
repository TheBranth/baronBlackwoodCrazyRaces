export default class Player {
    constructor(name, startNodeId, character) {
        this.name = name;
        this.money = 1000 * (character.startMoneyModifier || 1);
        this.car = { speed: 3, condition: 100 };
        this.currentNodeId = startNodeId;
        this.shares = [];
        this.passiveAbility = character.getAbility();
    }

    move(board, newNodeId) {
        const targetNode = board.findNodeById(newNodeId);
        if (targetNode) {
            this.currentNodeId = newNodeId;
            console.log(`${this.name} moved to ${targetNode.name}.`);
        } else {
            console.error(`Node with ID ${newNodeId} not found.`);
        }
    }

    buyCar(newCar) {
        if (this.money >= newCar.price) {
            this.money -= newCar.price;
            this.car = { speed: newCar.speed, condition: 100 };
            console.log(`${this.name} bought a ${newCar.name} for ${newCar.price}.`);
        } else {
            console.log(`${this.name} cannot afford the ${newCar.name}.`);
        }
    }

    buyShares(cityId, sharePrice) {
        if (this.money >= sharePrice) {
            this.money -= sharePrice;
            this.shares.push(cityId);
            console.log(`${this.name} bought shares in ${cityId} for ${sharePrice}.`);
        } else {
            console.log(`${this.name} cannot afford shares in ${cityId}.`);
        }
    }
}
