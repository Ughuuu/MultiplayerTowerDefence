/// <reference path="../../../node_modules/@types/three/index.d.ts" />
class Hud {
    container: any;
    damageLabel: HTMLLabelElement;
    healthLabel: HTMLLabelElement;
    nameLabel: HTMLLabelElement;
    elementLabel: HTMLLabelElement;
    upgradesLabel: HTMLLabelElement;
    images: HTMLImageElement[];
    constructor(container) {
        this.damageLabel = document.createElement('label');
        this.healthLabel = document.createElement('label');
        this.nameLabel = document.createElement('label');
        this.elementLabel = document.createElement('label');
        this.upgradesLabel = document.createElement('label');
        this.container = container;
        this.images = [];
        container.appendChild(this.damageLabel);
        container.appendChild(this.healthLabel);
        container.appendChild(this.nameLabel);
        container.appendChild(this.elementLabel);
        container.appendChild(this.upgradesLabel);
    }
    public displayTowerInfo(towerType: TowerType, upgradeTowers: TowerType[], x: number, y: number) {
        this.clearAll();
        if (upgradeTowers) {
            this.upgradesLabel.innerHTML="<br> Upgrades:"
            for (let i = 0; i < upgradeTowers.length; i++) {
                this.images[i] = document.createElement('img');
                this.images[i].src = towerType[i].icon;
                this.images[i].draggable = false;
                this.images[i].addEventListener("click", () => this.onClick(towerType[i], x, y));
                this.images[i].addEventListener("mouseover", () => this.onMouseOver(towerType[i]));
                this.container.appendChild(this.images[i]);
            }
        }
        else {
            this.upgradesLabel.innerHTML = "<br> No upgrades available"
        }
        this.nameLabel.innerHTML = "<br> Name:" + towerType.name;
        
        this.damageLabel.innerHTML = "<br> Attack:" + towerType.damage;

        this.healthLabel.innerHTML = "<br>Health:" + towerType.health;

        this.elementLabel.innerHTML = "<br>Health:" + towerType.elementType;
    }

    public displayEmptyCell(towerType: TowerType[], x: number, y: number) {
        this.clearAll();
        this.upgradesLabel.innerHTML = "<br> Towers:";
        for (let i = 0; i < towerType.length; i++) {
            this.images[i] = document.createElement('img');
            this.images[i].style.width = '200px';
            this.images[i].src = towerType[i].icon;
            this.images[i].addEventListener("click", () => this.onClick(towerType[i], x, y));
            this.images[i].addEventListener("mouseover", () => this.onMouseOver(towerType[i]));
            this.container.appendChild(this.images[i]);
        }
    }
    public displayCreepInfo(towerType: TowerType, x: number, y: number) {
        this.nameLabel.innerHTML = "<br> Name:" + towerType.name;

        this.damageLabel.innerHTML = "<br> Attack:" + towerType.damage;

        this.healthLabel.innerHTML = "<br>Health:" + towerType.health;

        this.elementLabel.innerHTML = "<br>Health:" + towerType.elementType;

    }

    public onClick(towerType: TowerType, x: number, y: number) {
        let id = Main.getInstance().getTowerId(towerType);
        Main.getInstance().getCommunication().createTower(id, x, y);
    }

    public onMouseOver(towerType: TowerType) {
    }

    public clearAll() {
        for (let i = 0; i < this.images.length; i++) {
            this.container.removeChild(this.images[i]);
        }
        this.images = [];
        this.nameLabel.innerHTML = "";
        this.damageLabel.innerHTML = "";
        this.healthLabel.innerHTML = "";
        this.elementLabel.innerHTML = "";
    }
}