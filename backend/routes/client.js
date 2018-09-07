const validate = require('./utils').validate_exists;
const extract_data = require('./utils').extract_info;


const config = require('./config');
const key = config.key;
const jwt = require('jsonwebtoken');
const data = require('./DataModel');

var _ = require('lodash') // import all methods
var bcrypt = require('bcrypt');


var nodemailer = require('nodemailer');
const uuidv1 = require('uuid/v1');


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '*************',
    pass: '************'
  }
});

function sendEmail(subject, to, body, res){
    var mailOptions = {
      from: '"Bank"',
      to: to.email,
      subject: subject,
      text: "Dear " + to.name + ",\n\n" + body + "\n\n" + "Best Wishes\nYour Bank"
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        res.status(200).json({success: true, message: "New Password Sent Via Email"})
        console.log('Email sent: ' + mailOptions.to + " ... " + info.response);
      }
    });
}


cryptPassword = function(password, callback) {
   bcrypt.genSalt(10, function(err, salt) {
    if (err)
      return callback(err);

    bcrypt.hash(password, salt, function(err, hash) {
      return callback(err, hash);
    });
  });
};



comparePassword = function(plainPass, hashword, callback) {
   bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {
       return err == null ?
           callback(null, isPasswordMatch) :
           callback(err);
   });
};


module.exports = (router,con) => {


  // Fetches client's user account and then gets the email and send him a reset password email
  router.post('/forget-pwd',(req,res)=>{
    if(!validate(req,['national_id']))
      return res.status(300).json({success: false, message: "Missing Data"});

    var nid = req.body.national_id;
    var sql_query = `SELECT * FROM ONLINE_ACCOUNT A, CLIENT C WHERE A.client_nid = national_id AND A.client_nid = '${nid}'`;
    con.query(sql_query, (err, result) => {
      if (err) return res.status(300).json({success: false, message: err});
      if (result.length == 0) return res.status(300).json({success: false, message: "Can't Find Client"});

      var new_pass = uuidv1();
      var to = {
        name: result[0].client_name,
        email: result[0].email
      };

      var subject = "New Password";
      var body = `Login With Your New Password: ${new_pass}, you'll be prompted to change it upon login`;


      var onlineAccountData = {};
      var onlineAccount = new data.DataModel(con,"ONLINE_ACCOUNT");


      cryptPassword(new_pass, (err, hashed_password)=>{
        if (err) return res.status(300).json({success: false, message: err});


        onlineAccountData['account_password'] = hashed_password;
        onlineAccountData['isNewPassword'] = '1';

        var onlineAccountSearch = {};
        onlineAccountSearch['client_nid'] = nid;


        onlineAccount.update(onlineAccountData,onlineAccountSearch,(err, result)=>{
          if (err) return res.status(300).json({success: false, message: err});
          sendEmail(subject, to, body, res);
        })

      })


    })

  })

  router.use((req,res,next) => {
    // VALIDATE THAT REQUEST CONTAINS AUTHORIZATION
    if(!validate(req,['token']))
      return res.status(300).json({success: false, auth_problem: true, message: "Can't Find Token"});

    const token = req.body.token;
    jwt.verify(token, key, (error, decoded) =>{
      if(error){
        return res.status(300).json({success: false, auth_problem: true, message: "Wrong Token"});
      }

      var onlineAccount =  new data.DataModel(con,"ONLINE_ACCOUNT");
      var onlineAccountData = {};
      onlineAccountData['username'] = decoded.username;
      onlineAccount.search(onlineAccountData, (err, result) => {
        if(err)
          return res.status(300).json({success: false, auth_problem: true, message: err});

        if(result.length == 0)
          return res.status(300).json({success: false, auth_problem: true, message: 'Error retrieving account from token'});

        if(result[0].user_role != 1 && result[0].client_nid == null)
          return res.status(300).json({success: false, message: 'User Unauthorized to perform Client Operations'});

        console.log("Okay Passed All the tests")
        req.userInfo = result[0];
        next()

      })
    })
  });



  // Returns a list of all bank accounts associated with the client's account
  router.post('/view-accounts',(req,res)=>{

    if(req.userInfo.isNewPassword == 1)
      return res.status(300).json({success: false, message: "User has to change password!"});

    // NO VALIDATION REQUIRED
    var bankAccountData = {};
    bankAccountData['client_nid'] = req.userInfo.client_nid;

    var BankAccount = new data.DataModel(con,"BANK_ACCOUNT");
    BankAccount.search(bankAccountData, (err, result) =>{
        if (err) return res.status(300).json({success: false, message: err});

        return res.status(200).json({success: true, accounts: result});
    })


  })




 // Returns a list of all transactions made with the bank account with the account performing it
  router.post('/view-transactions',(req,res)=>{

    if(req.userInfo.isNewPassword == 1)
      return res.status(300).json({success: false, message: "User has to change password!"});


    if(!validate(req,['bank_account_number']))
      return res.status(300).json({success: false, message: "Missing Data"});

    var bankAccount = new data.DataModel(con,"BANK_ACCOUNT");
    var bankAccountData = {};
    bankAccountData['account_number'] = req.body.bank_account_number;

    bankAccount.search(bankAccountData,(err, accounts_result) => {
      if (err) return res.status(300).json({success: false, message: err});
      if (accounts_result.length == 0) return res.status(200).json({success: false, message: "Can't Find Account"});
      if (accounts_result[0].client_nid != req.userInfo.client_nid) return res.status(200).json({success: false, message: "Account does not belong to user"});

      var transData = {};
      transData['bank_account_number'] = req.body.bank_account_number;
      var bankTransaction = new data.DataModel(con,"BANK_TRANSACTION");

      bankTransaction.search(transData, (err,result)=>{
        if (err) return res.status(300).json({success: false, message: err});

        return res.status(200).json({success: true, transactions: result});
      })
    })
  })


  router.post('/get-info', (req,res)=>{

    if(req.userInfo.isNewPassword == 1)
      return res.status(300).json({success: false, message: "User has to change password!"});

    var userDetails = {};
    userDetails['national_id'] = req.userInfo.client_nid;
    var onlineAccount = new data.DataModel(con, "CLIENT");
    onlineAccount.search(userDetails, (err, data) => {
      if (err) return res.status(300).json({success: false, message: err});
      if (data.length == 0) return res.status(300).json({success: false, message: "Can't Find User"});

      user_data = _.pick(data[0],'phone' ,'email');

      return res.status(200).json({success: true, user_data: user_data})

    })



  })

  router.post('/update-info', (req,res)=>{

  var userSearch = {};
  userSearch['national_id'] = req.userInfo.client_nid;

  if(req.userInfo.isNewPassword == 1)
    return res.status(300).json({success: false, message: "User has to change password!"});

  var infoData = {};

  if(req.body.phone && req.body.phone.trim())
    infoData['phone'] = req.body.phone.trim();

  if(req.body.email && req.body.email.trim())
    infoData['email'] = req.body.email.trim();


  if(Object.keys(infoData).length == 0)
    return res.status(300).json({success: false, message: "No Information Sent"});


  var client = new data.DataModel(con, "CLIENT");
  client.update(infoData, userSearch, (err, result) => {
    if (err) return res.status(300).json({success: false, message: err});

    return res.status(200).json({success: true, message: "Info Updated Successfully"});
  })


  })

  // NEEDS FURTHER ENHANCEMENT
  //Transfer money from one bank account to any other bank account => returns status
  router.post('/transfer-money',(req,res)=>{

    if(req.userInfo.isNewPassword == 1)
      return res.status(300).json({success: false, message: "User has to change password!"});


    if(!validate(req,['from_bank_account','to_bank_account','amount']))
    return res.status(300).json({success: false, message: "Missing Data"});

    var from = req.body.from_bank_account.trim();
    var to = req.body.to_bank_account.trim();
    var amount = req.body.amount.trim();

    if(from === to)
    return res.status(300).json({success: false, message: "Bank Accounts Must Be different"});

    var fromBankAccountData = {};
    fromBankAccountData['account_number'] = from;
    var BankAccount = new data.DataModel(con, "BANK_ACCOUNT");
    BankAccount.search(fromBankAccountData,(err, fromBankResult) => {
      if (err) return res.status(300).json({success: false, message: err});
      if (fromBankResult.length == 0) return res.status(300).json({success: false, message: 'Sending Bank Account Does Not Exist'});
      if (fromBankResult[0].client_nid != req.userInfo.client_nid) return res.status(300).json({success: false, message: 'Bank Account Does Not Belong To Client'});

      var from_client_nid = fromBankResult[0].client_nid;
      var from_currency = fromBankResult[0].currency_name;

      var fromBankAccountUpdates = {};
      fromBankAccountUpdates['balance'] = fromBankResult[0].balance - amount;

      if(fromBankAccountUpdates['balance'] < 0)  return res.status(300).json({success: false, message: 'Insufficient Funds!'});

      var toBankAccountData = {};
      toBankAccountData['account_number'] = to;
      BankAccount.search(toBankAccountData, (err, toBankResult)=>{
        if (err) return res.status(300).json({success: false, message: err});
        if (toBankResult.length == 0) return res.status(300).json({success: false, message: 'Receiving Bank Account Does Not Exist'});

        var to_currency = toBankResult[0].currency_name;
        var to_client_nid = toBankResult[0].client_nid;

        var currencyExchangeData = {};
        currencyExchangeData['currency_first'] = from_currency;
        currencyExchangeData['currency_second'] = to_currency;

        if(from_currency != to_currency){
          var CurrencyExchange = new data.DataModel(con, "EXCHANGE_RATE");
          CurrencyExchange.search(currencyExchangeData, (err, currencyExchangeResult)=>{
            if (err) return res.status(300).json({success: false, message: err});
            if (currencyExchangeResult.length == 0) return res.status(300).json({success: false, message: "Can't find exchange rate for the currencies"});

            var amount_after_change = parseFloat(amount) * parseFloat(currencyExchangeResult[0].exchange_factor);

            var toBankAccountUpdates = {};
            toBankAccountUpdates['balance'] = toBankResult[0].balance + amount_after_change;

            BankAccount.update(fromBankAccountUpdates,fromBankAccountData, (err, result) =>{
              if (err) return res.status(300).json({success: false, message: err});
              BankAccount.update(toBankAccountUpdates, toBankAccountData, (err,result) => {
                if (err) return res.status(300).json({success: false, message: err});

                // Transactions Placement Here
                var fromtransactionData = {};
                fromtransactionData['bank_account_number'] = from;
                fromtransactionData['bank_account_client_nid'] = from_client_nid;
                fromtransactionData['account_username'] = req.userInfo.username;
                fromtransactionData['transaction_type'] = "withdraw";
                fromtransactionData['transaction_info'] = "Transfer To " + to;
                fromtransactionData['transaction_amount'] = amount;


                var totransactionData = {};
                totransactionData['bank_account_number'] = to;
                totransactionData['bank_account_client_nid'] = to_client_nid;
                totransactionData['account_username'] = req.userInfo.username;
                totransactionData['transaction_type'] = "deposit";
                totransactionData['transaction_info'] = "Transfer from " + from;
                totransactionData['transaction_amount'] = amount_after_change;

                var transaction = new data.DataModel(con,"BANK_TRANSACTION");
                transaction.insert(fromtransactionData,(err, result) =>{
                  if (err) return res.status(300).json({success: false, message: err});
                  transaction.insert(totransactionData,(err,result)=>{
                    if (err) return res.status(300).json({success: false, message: err});
                    return res.status(200).json({success: true, message: "money transferred"});
                  })
                })


              })
            })
          })
        }else {

          var amount_after_change = parseFloat(amount) ;

          var toBankAccountUpdates = {};
          toBankAccountUpdates['balance'] = toBankResult[0].balance + amount_after_change;

          BankAccount.update(fromBankAccountUpdates,fromBankAccountData, (err, result) =>{
            if (err) return res.status(300).json({success: false, message: err});
            BankAccount.update(toBankAccountUpdates, toBankAccountData, (err,result) => {
              if (err) return res.status(300).json({success: false, message: err});

              // Transactions Placement Here
              var fromtransactionData = {};
              fromtransactionData['bank_account_number'] = from;
              fromtransactionData['bank_account_client_nid'] = from_client_nid;
              fromtransactionData['account_username'] = req.userInfo.username;
              fromtransactionData['transaction_type'] = "withdraw";
              fromtransactionData['transaction_info'] = "Transfer To " + to;
              fromtransactionData['transaction_amount'] = amount;


              var totransactionData = {};
              totransactionData['bank_account_number'] = to;
              totransactionData['bank_account_client_nid'] = to_client_nid;
              totransactionData['account_username'] = req.userInfo.username;
              totransactionData['transaction_type'] = "deposit";
              totransactionData['transaction_info'] = "Transfer from " + from;
              totransactionData['transaction_amount'] = amount_after_change;

              var transaction = new data.DataModel(con,"BANK_TRANSACTION");
              transaction.insert(fromtransactionData,(err, result) =>{
                if (err) return res.status(300).json({success: false, message: err});
                transaction.insert(totransactionData,(err,result)=>{
                  if (err) return res.status(300).json({success: false, message: err});
                  return res.status(200).json({success: true, message: "money transferred"});
                })
              })
            })
          })
        }
      })
    })
  })


  //Change Account Password => Returns status
  router.post('/change-pwd',(req,res)=>{

    if(!validate(req,['account_password']))
      return res.status(300).json({success: false, message: "Missing Data"});

      cryptPassword(req.body.account_password, (err, hashed_password)=>{

        var changed_data = {};
        changed_data['account_password'] = hashed_password;
        changed_data['isNewPassword'] = '0';


        var search_data = {};
        search_data['username'] = req.userInfo.username;

        var onlineAccount =  new data.DataModel(con,"ONLINE_ACCOUNT");
        onlineAccount.update(changed_data, search_data,(err,update_result) => {
          if(err) return res.status(300).json({success: false, message: err});

          return res.status(200).json({success: true, message: "Password Changed Successfully"});

        })
      })

  })


  return router;
}
