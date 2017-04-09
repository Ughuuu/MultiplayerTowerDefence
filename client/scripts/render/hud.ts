/// <reference path="../../../node_modules/@types/three/index.d.ts" />
class Hud {
    container: any;
    damageLabel: HTMLLabelElement;
    healthLabel: HTMLLabelElement;
    nameLabel: HTMLLabelElement;
    elementLabel: HTMLLabelElement;
    upgradesLabel: HTMLLabelElement;
    moneyLabel: HTMLDivElement;
    lifeLabels: HTMLDivElement[];
    buildingImages: HTMLImageElement[];
    unitImages: HTMLImageElement[];
    unitsDiv: HTMLDivElement;
    playersLife: Map<string, HTMLDivElement>
    playerInfo: HTMLDivElement;
    constructor(container) {
        this.damageLabel = document.createElement('label');
        this.healthLabel = document.createElement('label');
        this.nameLabel = document.createElement('label');
        this.elementLabel = document.createElement('label');
        this.upgradesLabel = document.createElement('label');
        this.unitsDiv = document.createElement('div');
        this.unitsDiv.id = "units";

        this.playerInfo = document.createElement('div');
 
        this.playersLife = new Map<string, HTMLDivElement>();
        this.playerInfo.id = "name";
        this.moneyLabel = document.createElement('div');
        this.moneyLabel.id = "money";
        this.lifeLabels = [];

        this.container = container;
        this.unitImages = [];
        this.buildingImages = [];
        container.appendChild(this.damageLabel);
        container.appendChild(this.healthLabel);
        container.appendChild(this.nameLabel);
        container.appendChild(this.elementLabel);
        container.appendChild(this.upgradesLabel);
        container.appendChild(this.unitsDiv);
        container.appendChild(this.moneyLabel);
        container.appendChild(this.playerInfo);
    }
    public displayTowerInfo(towerType: TowerType, upgradeTowers: TowerType[], x: number, y: number) {
        this.clearAll();
        if (upgradeTowers) {
            this.upgradesLabel.innerHTML="<br> Upgrades:"
            for (let i = 0; i < upgradeTowers.length; i++) {
                this.buildingImages[i] = document.createElement('img');
                this.buildingImages[i].src = towerType[i].icon;
                this.buildingImages[i].draggable = false;
                this.buildingImages[i].addEventListener("click", () => this.onClickBuilding(towerType[i], x, y));
                this.buildingImages[i].addEventListener("mouseover", () => this.onMouseOverBuilding(towerType[i]));
                this.container.appendChild(this.buildingImages[i]);
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
            this.buildingImages[i] = document.createElement('img');
            this.buildingImages[i].className = "buildings";
                this.buildingImages[i].draggable = false;
          
            this.buildingImages[i].src = towerType[i].icon;
            this.buildingImages[i].addEventListener("click", () => this.onClickBuilding(towerType[i], x, y));
            this.buildingImages[i].addEventListener("mouseover", () => this.onMouseOverBuilding(towerType[i]));
            this.container.appendChild(this.buildingImages[i]);
        }
    }
    public displayCreepInfo(towerType: TowerType, x: number, y: number) {
        this.nameLabel.innerHTML = "<br> Name:" + towerType.name;

        this.damageLabel.innerHTML = "<br> Attack:" + towerType.damage;

        this.healthLabel.innerHTML = "<br>Health:" + towerType.health;

        this.elementLabel.innerHTML = "<br>Health:" + towerType.elementType;

    }

    public drawBuyUnits(unitType: UnitType[]) {
        for (let i = 0; i < this.unitImages.length; i++) {
            this.unitsDiv.removeChild(this.unitImages[i]);
        }
        for (let i = 0; i < unitType.length; i++) {
            this.unitImages[i] = document.createElement('img');
            let iconPath = unitType[i].model.substr(0, unitType[i].model.lastIndexOf("/"));
            iconPath += "/icon.png";
            this.unitImages[i].className = "units";
            this.unitImages[i].src = iconPath;
          
            this.unitImages[i].addEventListener("click", () => this.onClickUnit(unitType[i]));
            this.unitImages[i].addEventListener("mouseover", () => this.onMouseOverUnit(unitType[i]));
            this.unitsDiv.appendChild(this.unitImages[i]);
            this.unitImages[i].draggable = false;
        }
    }

    public onClickBuilding(towerType: TowerType, x: number, y: number) {
        let id = Main.getInstance().getTowerId(towerType);
        Main.getInstance().getCommunication().createTower(id, x, y);
    }

    public onMouseOverBuilding(towerType: TowerType) {
    }

    public onClickUnit(unitType: UnitType) {
        let id = Main.getInstance().getUnitId(unitType);
        Main.getInstance().getCommunication().createUnit(id);
    }

    public onMouseOverUnit(towerType: UnitType) {
    }

    public setMoney(money: number, income:number) {
        this.moneyLabel.innerHTML = "Money:" + money + "<br> Income:" + income;
    }
    public setLife(playerID: string, value: number) {
        if (!(playerID in this.playersLife)) {
            this.playersLife[playerID] = document.createElement('div');
            this.playersLife[playerID].className = "life";
            
            this.container.appendChild(this.playersLife[playerID]);
        }
        this.playersLife[playerID].innerHTML = 'Hp of ' + playerID + ': ' + value;
    }

    public setPlayerInfo(playerInfo: any) {
        this.playerInfo.innerHTML = playerInfo;
    }
    public clearAll() {
        for (let i = 0; i < this.buildingImages.length; i++) {
            this.container.removeChild(this.buildingImages[i]);
        }
        this.unitImages = [];
        this.buildingImages = [];
        this.nameLabel.innerHTML = "";
        this.damageLabel.innerHTML = "";
        this.healthLabel.innerHTML = "";
        this.elementLabel.innerHTML = "";
    }
}