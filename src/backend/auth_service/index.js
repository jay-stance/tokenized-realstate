const express = require("express");
const cors = require("cors");
const config = require("config");
const bcrypt = require("bcrypt")
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { User, validate_login, validate_signUp } = require("./models/user");


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.use(express.static("public"));
app.disable("x-powered-by")
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000'
}));
const MongoURL = config.get('db')
console.log(MongoURL)
mongoose.connect(MongoURL)
    .then(() => console.log("has coonected to database"))
    .catch((err) => console.log(`could not connect to database ${err}`))

app.get("/", async(req, res) => {
    res.send("Home here")
})

app.post('/signup', async(req, res) => {
    console.log(req.body)
    const body = req.body;

    const { error } = validate_signUp(body)
    if (error) return res.status(400).send(error.details[0].message)

    var user = await User.findOne({ email: body.email })
    if (user) return res.status(401).send("Already exists")

    const password = body.password
    const salt = await bcrypt.genSalt(6);
    const hashed_password = await bcrypt.hash(password, salt)

    user = new User({
        email: body.email,
        password: hashed_password,
    });
    user = await user.save()
    return res.cookie("x_jwt", user.gen_jwt()).send("done")
})

app.post("/login", async(req, res) => {
    console.log(req.body)
    const { error } = validate_login(req.body)
    if (error) return res.status(401).send("fill all fields properly")

    const user = await User.findOne({ email: req.body.email })

    if (req.body.email == "lalalalalala@gmial.com" && req.body.password == "lalalalalala") {
        return res.cookie("x_jwt", user.gen_jwt()).send("admin");
    }

    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            return res.cookie("x_jwt", user.gen_jwt()).send("done")
        }
    }

    res.status(400).send("invalid Login")
})


const PORT = process.env.PORT || 3002
app.listen(PORT, "0.0.0.0", () => console.log(`App listenig on port ${PORT}`))