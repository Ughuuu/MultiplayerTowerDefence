/// <reference path="../../../node_modules/@types/three/index.d.ts" />
class Hud {
    container: any;
    damageLabel: HTMLLabelElement;
    healthLabel: HTMLLabelElement;
    nameLabel: HTMLLabelElement;
    elementLabel: HTMLLabelElement;
    constructor(container) {
        this.damageLabel = document.createElement('label');
        this.healthLabel = document.createElement('label');
        this.nameLabel = document.createElement('label');
        this.elementLabel = document.createElement('label');
        this.container = container;
        container.appendChild(this.damageLabel);
        container.appendChild(this.healthLabel);
        container.appendChild(this.nameLabel);
        container.appendChild(this.elementLabel);
    }
    public displayTowerInfo(towerType: TowerType) {
        this.nameLabel.innerHTML = "<br> Name:" + towerType.name;
        
        this.damageLabel.innerHTML = "<br> Attack:" + towerType.damage;

        this.healthLabel.innerHTML = "<br>Health:" + towerType.health;

        this.elementLabel.innerHTML = "<br>Health:" + towerType.elementType;

    }

    public displayCreepInfo(towerType: TowerType) {
        this.nameLabel.innerHTML = "<br> Name:" + towerType.name;

        this.damageLabel.innerHTML = "<br> Attack:" + towerType.damage;

        this.healthLabel.innerHTML = "<br>Health:" + towerType.health;

        this.elementLabel.innerHTML = "<br>Health:" + towerType.elementType;

    }
}