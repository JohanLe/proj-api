const bcrypt = require('bcryptjs');


const helperFunction = {

    hashPass: (password) => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                    if (err) {
                        reject(err)
                    }
                    resolve(hash);
                });
            });
        });
    },
    deCryptPassword: (password, hash) => {

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash).then((res) => {
                if (res) {
                    resolve(res);
                    console.log("resolve");
                }
                reject({
                    status: 400,
                    msg: "Wrong password"
                });
            });
        });

    },
    createRandomId: (length) => {
        var result = '';
        var characters = 'qxyztrwvjhgfmn0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return (result);
    },
    updateCurrentUser: (newUserData) => {
        localStorage.setItem("user", newUserData);
        console.log("New userdata: " + newUserData);
    }

}

module.exports = helperFunction;