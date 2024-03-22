SystemState.commit = function(previous, next) {
    if(!SystemValidity.validate(previous, next)) {
        throw "The System data to be committed is invalid"
    }

    this.systemData = next
}