const password = "qwerty123";
const hah = "$2a$10$gDMW3Kk2/9yMqMcsO83Y5.T6/OKi2jc.eJAeM1Y.Yrqn75mPshs5y"
const hash = await Bun.password.hash(password);
const bcryptHash = await Bun.password.hash(password, { algorithm: "bcrypt", cost: 10 })
const isMatch = await Bun.password.verify(password, bcryptHash);
// => true
console.log(hah)
console.log(isMatch)
console.log(password)
console.log(bcryptHash)
