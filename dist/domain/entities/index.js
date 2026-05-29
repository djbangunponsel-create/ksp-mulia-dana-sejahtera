"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanStatus = exports.MemberStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["MANAGER"] = "manager";
    UserRole["STAFF"] = "staff";
    UserRole["MEMBER"] = "member";
})(UserRole || (exports.UserRole = UserRole = {}));
var MemberStatus;
(function (MemberStatus) {
    MemberStatus["ACTIVE"] = "active";
    MemberStatus["INACTIVE"] = "inactive";
    MemberStatus["SUSPENDED"] = "suspended";
})(MemberStatus || (exports.MemberStatus = MemberStatus = {}));
var LoanStatus;
(function (LoanStatus) {
    LoanStatus["PENDING"] = "pending";
    LoanStatus["APPROVED"] = "approved";
    LoanStatus["REJECTED"] = "rejected";
    LoanStatus["DISBURSED"] = "disbursed";
    LoanStatus["PAID"] = "paid";
    LoanStatus["DEFAULTED"] = "defaulted";
})(LoanStatus || (exports.LoanStatus = LoanStatus = {}));
//# sourceMappingURL=index.js.map