require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const PORT = 8001;


require('./database_config');

const userRouter = require("./src/routes/user");
// const adminRouter = require("./src/routes/admin");
const taskRouter = require("./src/routes/postproject");
const candidateRouter = require("./src/routes/candidate");

var admin = require("firebase-admin");
var serviceAccount = require("./postingapp-ce201-firebase-adminsdk-6j95g-d5e3b5766c.json");

const {GoogleAuth} = require('google-auth-library');
const auth = new GoogleAuth({
  keyFile: './postingapp-d2c07-d21733d96ecf.json',
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)

});



const secret_key = process.env.SECRET_KEY;
const stripe = require("stripe")(secret_key);

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.use('/src/uploads', express.static(path.join(__dirname, 'src/uploads')));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.post("/api/create-payment-intent", async (req, res) => {
    const { amount } = req.body;
    const customer = await stripe.customers.create();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      customer: customer.id,
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
      customer: customer.id,
      paymentIntentId: paymentIntent.id,
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://192.168.148.100:${PORT}`);
});
// app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));
app.use("/api/user", userRouter);
// app.use("/api/admin", adminRouter);
app.use("/api/task", taskRouter);
app.use("/api/candidate", candidateRouter);

