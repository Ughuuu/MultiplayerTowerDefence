import { Point } from './point';
import { WalkType } from './walk.type';
import { ElementType } from './element.type';
const b2 = require ( 'lucy-b2' );

export class Unit {
    position: Point;
    speed: Point;
    health: number;
    walkType: WalkType;
    elementType: ElementType;
    owner: number;
    body: any;

    constructor(position: Point, speed: Point, health: number, walkType: WalkType, elementType: ElementType, owner: number) {
        this.position = position;
        this.speed = speed;
        this.health = health;
        this.walkType = walkType;
        this.elementType = elementType;
        this.owner = owner;
    }

    update(): void{
        this.position.x+=this.speed.x;
        this.position.y+=this.speed.y;
    }

    setBody(world){        
        // Define body
        let bodyDef = new b2.BodyDef;
        bodyDef.type = b2.BodyType.dynamicBody;
        this.body = world.CreateBody ( bodyDef );
        // Define fixture
        let fixDef = new b2.FixtureDef;
        fixDef.density     = 1.0;
        fixDef.friction    = 0.2;
        fixDef.restitution = 0.8;

        let shape = new b2.PolygonShape;
        shape.SetAsBox ( 0.1, 0.1 );

        fixDef.shape = shape;

        // Create fixture
        this.body.CreateFixture ( fixDef )

        // Move body into initial position ( and rotation )
        this.body.SetTransform ( 0, 2, 0 )
    }

    destroyBody(world){
        world.DestroyBody(this.body);
    }
}