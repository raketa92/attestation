const axios = require("axios");
const https = require("https");
const { v4: uuidv4 } = require("uuid");

let paid = false;
let comment = null;
let amount = null;

exports.showMainPage = async (req, res, next) => {
  res.render("index", {
    title: "main page",
    paid: paid,
    comment: comment,
    amount: amount,
  });
};

exports.registerOrder = async (req, res, next) => {
  comment = req.body.comment;
  amount = req.body.amount;
  let orderNumber = uuidv4();

  let returnUrl = "http://localhost:4000/result";
  let userName = "client5";

  let text = userName + "-spasem-mir";
  let reverseString = text.split("").reverse();
  let paymentUrl = null;
  let password = 0;
  for (i in reverseString) {
    password += reverseString[i].charCodeAt(0);
  }

  axios
    .post("http://attest.turkmen-tranzit.com/payment/rest/register.do", {
      amount: parseInt(amount),
      orderNumber: orderNumber.toString(),
      password: password.toString(),
      returnUrl: returnUrl,
      userName: userName,
    })
    .then((response) => {
      console.log(response.data);
      paymentUrl = response.data.formUrl;

      return res.render("payment", {
        formUrl: paymentUrl,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.showPayment = async (req, res, next) => {
  res.render("payment", {
    formUrl: paymentUrl,
  });
};

exports.getResult = async (req, res, next) => {
  try {
    let orderId = req.query.orderId;

    let userName = "client5";
    let text = userName + "-spasem-mir";
    let reverseString = text.split("").reverse();
    let password = 0;
    for (i in reverseString) {
      password += reverseString[i].charCodeAt(0);
    }

    axios
      .post(
        "http://attest.turkmen-tranzit.com/payment/rest/getOrderStatus.do",
        {
          orderId: orderId,
          password: password.toString(),
          userName: userName,
        }
      )
      .then((response) => {
        console.log(response.data);
        paid = true;
        return res.render("result", {
          status: response.data.errorMessage,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};
