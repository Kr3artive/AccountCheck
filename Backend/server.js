import express from "express"
import fetch  from "node-fetch"
import axios from "axios"
const account = express()
const port = 8000
account.use(express.json())


const PAYSTACKsk = "sk_test_9fdc676ee109eaa78aed6a662a05136137fd8f84";
const PAYSTACKpk = "pk_test_bd2b17a282f57edd6b7a30b5c8e0b3421eaa1e1b";
const getBankUrl = "https://api.paystack.co/bank";
const verifyBankUrl = "https://api.paystack.co/bank/resolve"

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

account.get("/",(req,res)=>{
    res.send("THIS IS THE HOME PAGE")
})

account.get("/listbanks",async (req, res)=>{
    try {
        const response = await fetch(getBankUrl, {
            headers: {
                Authorization: `Bearer ${PAYSTACKsk}`
            }
        })
        const data = await response.json()
        console.log(data);
        const banks = data.data

        const bankslist = banks.map(bank=>({
            code: bank.code,
            name: bank.name
        }))
        res.json(bankslist)
    } catch (error) {
        console.log(error);
    }
}) 
account.post("/getname",async (req,res)=>{
    const {accountnum, code}= req.body
    const options = {
        method: "GET",
        url: "https://api.paystack.co/bank/resolve/",
        params: {
            account_number: accountnum,
            bank_code: code
        },
        headers: {
            Authorization: `Bearer ${PAYSTACKsk}`
        }
    }
    try {
        const response = await axios(options)
        console.log(response);
        res.json(response.data)
    } catch (error) {
        console.log(error);
    }
})

account.listen(port,()=>{
    console.log("SERVER IS ACTIVE AT http://localhost:8000");
})