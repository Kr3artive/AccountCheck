import express from "express";
import fetch from "node-fetch";
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();;
const account = express();
account.use(express.json());

const PORT = process.env.PORT
const PAYSTACKsk = process.env.PAYSTACKsk;
const getBankUrl = "https://api.paystack.co/bank/";


account.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

account.get("/", (req, res) => {
  res.send("THIS IS THE HOME PAGE");
});

account.get("/listbanks", async (req, res) => {
  try {
    const response = await fetch(getBankUrl, {
      headers: {
        Authorization: `Bearer ${PAYSTACKsk}`,
      },
    });
    const data = await response.json();
    const banks = data.data;

    const bankslist = banks.map((bank) => ({
      code: bank.code,
      name: bank.name,
    }));
    res.json(bankslist);
  } catch (error) {
    console.log(error);
  }
});
account.post("/getname", async (req, res) => {
  const { accountnum, code } = req.body;
  console.log(PAYSTACKsk);
  
  const options = {
    method: "GET",
    url: "https://api.paystack.co/bank/resolve/",
    params: {
      account_number: accountnum,
      bank_code: code,
    },
    headers: {
      Authorization: `Bearer ${PAYSTACKsk}`,
    },
  };
  console.log(options);
  try {
    const response = await axios(options);
    console.log(response);
    res.json(response.data);
  } catch (error) {
    console.log(error);
  }
});

account.listen(PORT, () => {
  console.log(`SERVER IS ACTIVE ON PORT ${PORT}`);
});