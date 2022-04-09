import { getObjectsByPrototype, createConstructionSite, findClosestByPath } from '/game/utils';
import { Creep, StructureContainer, StructureTower, ConstructionSite  } from '/game/prototypes';
import { RESOURCE_ENERGY, ERR_NOT_IN_RANGE, ERR_INVALID_TARGET } from '/game/constants';
// import { } from '/arena';

export function loop() {
    const myCreeps = getObjectsByPrototype(Creep).filter(creep => creep.my);
    const containers = getObjectsByPrototype(StructureContainer);

    myCreeps.forEach(myCreep => {
        const constructionSite = getObjectsByPrototype(ConstructionSite).find(i => i.my);

        if(!constructionSite) {
            const container = findClosestByPath(myCreep, containers);

            // TODO: loop until valid location is found.

            constructionSite = createConstructionSite({x: container.x + 5, y: container.y}, StructureTower);
        }

        console.log("Free creep capacity: " + myCreep.store.getFreeCapacity(RESOURCE_ENERGY));
        if(myCreep.store.getFreeCapacity(RESOURCE_ENERGY)){
            console.log("Finding the closest source for creep");
            // find closest source
            const container = findClosestByPath(myCreep, containers);
            if(myCreep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                myCreep.moveTo(container);
            }
        } else {
            console.log("Build Time!");
            const rc = myCreep.build(constructionSite);
            
            if(rc == ERR_NOT_IN_RANGE) {
                myCreep.moveTo(constructionSite);
            } else if (rc == ERR_INVALID_TARGET) {
                console.log("Invalid construction site!");
            }
            else {
                console.log("Error when building: " + rc);
            }
        }
    });
}
