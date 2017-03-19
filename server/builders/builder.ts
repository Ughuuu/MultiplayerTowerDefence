export abstract class Builder {
    constructor(public name: string) { }

    abstract get(id: number): any;
    abstract remove(id: number): void;
}