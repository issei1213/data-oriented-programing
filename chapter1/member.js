class Member {
    isBlocked = true

    displayBlockedStatusTwice() {
        console.log(this.isBlocked);
        console.log(this.isBlocked);
    }
}

var member = new Member();
member.displayBlockedStatusTwice();
