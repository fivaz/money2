import {ORM} from "./ORM";

export class Parent extends ORM {

    constructor() {
        super();
    }

    get children() {
        throw "Error this method should be overridden by its extended class";
    }

    set children(value) {
        throw "Error this method should be overridden by its extended class";
    }

    addChild(child) {
        this.children.push(child);
    }

    removeChild(child) {
        if (this.children.includes(child)) {
            const index = this.children.indexOf(child);
            this.children.splice(index, 1);
        }
    }
}