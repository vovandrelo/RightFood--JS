class Register {
    toLowerCase(str) {
        return str.toLowerCase();
    }
    toFirstCaps(str) {
        return str[0].toUpperCase() + str.slice(1);
    }
}

export default new Register();