import {BridgeCallEvent} from "./types";

function bridgeLogger({callID, wallet, callType, to, value, data, signature, owner }: BridgeCallEvent) {
    let log : String = `callID: ${callID}, wallet: ${wallet}, callType: ${callType}, to: ${to}, value: ${value}, data: ${data}, signature: ${signature}, owner: ${owner}`
    console.log("Call received: ", log)
}

export {
    bridgeLogger
}