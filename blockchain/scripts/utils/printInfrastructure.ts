import {InfrastructureAddresses} from "../type/infrastructure";

export function printInfrastructure(infrastrureAddresses : InfrastructureAddresses){
    for (const [key, value] of Object.entries(infrastrureAddresses)) {
        console.log(`${key} = ${value}`);
    }
}