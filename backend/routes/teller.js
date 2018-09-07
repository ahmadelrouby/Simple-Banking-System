const validate = require('./utils').validate_exists;
const extract_data = require('./utils').extract_info;

const config = require('./config');
const key = config.key;
const jwt = require('jsonwebtoken');
const data = require('./DataModel');
var twilio = require('twilio');



var _ = require('lodash') // import all methods
var bcrypt = require('bcrypt');

var accountSid = '**********'; // Your Account SID from www.twilio.com/console
var authToken = '*********';   // Your Auth Token from www.twilio.com/console
var client = new twilio(accountSid, authToken);




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

        if(result[0].user_role != 2)
          return res.status(300).json({success: false, message: 'User Unauthorized to perform Teller Operations'});

        console.log("Okay Passed All the tests")
        req.userInfo = result[0];
        next()

      })
    })
  });

  // Allows changing the password but only the first time after being changed by an admin
  router.post('/change-pwd',(req,res)=>{

    if(!validate(req,['new_password']))
       return res.status(300).json({success: false, message: "Missing Data"});

    if(req.userInfo.isNewPassword != 1)
      return res.status(300).json({success: false, message: "Can't Change Password Unless it's been changed by admin!"});

    cryptPassword(req.body.new_password, (err, hashed_password)=>{

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


  // Returns a list of bank accounts for a specific client identified by the client_id
  router.post('/view-accounts',(req,res)=>{
    if(req.userInfo.isNewPassword == 1)
      return res.status(300).json({success: false, message: "User has to change password!"});

    if(!validate(req,['client_id']))
      return res.status(300).json({success: false, message: "Missing Data"});


    var search_data = {};
    search_data['national_id'] = req.body.client_id;

    var client = new data.DataModel(con,"CLIENT");
    client.search(search_data, (err, search_result) => {
      if(err) return res.status(300).json({success: false, message: err});

      if(search_result.length == 0) return res.status(300).json({success: false, message: 'Client Does Not Exist!'});

      search_data = {};
      search_data['client_nid'] = req.body.client_id;

      var bank_account = new data.DataModel(con,"BANK_ACCOUNT");
      bank_account.search(search_data, (err, accounts_result) => {
        if(err) return res.status(300).json({success: false, message: err});

        return res.status(200).json({success: true, data: accounts_result});
      })

    })


  })

  // Returns Client Information ***
  router.post('/view-client',(req,res)=>{
    if(req.userInfo.isNewPassword == 1)
      return res.status(300).json({success: false, message: "User has to change password!"});

    if(!validate(req,['client_id']))
      return res.status(300).json({success: false, message: "Missing Data"});

    var search_data = {};
    search_data['national_id'] = req.body.client_id;

    var client = new data.DataModel(con,"CLIENT");
    client.search(search_data, (err, result) => {
      if(err) return res.status(300).json({success: false, message: err});
      if (result.length == 0) return res.status(300).json({success: false, exists_error: true});

      return res.status(200).json({success: true, data: result[0]});

    })
  })

  // Returns Transactions associatied with a specific bank account
  router.post('/view-transaction',(req,res)=>{
    if(req.userInfo.isNewPassword == 1)
      return res.status(300).json({success: false, message: "User has to change password!"});

    if(!validate(req,['bank_account_number']))
      return res.status(300).json({success: false, message: "Missing Data"});

    var search_data = {};
    search_data['bank_account_number'] = req.body.bank_account_number;

    var transaction = new data.DataModel(con,"BANK_TRANSACTION");
    transaction.search(search_data, (err, result) => {
      if(err) return res.status(300).json({success: false, message: err});

      return res.status(200).json({success: true, data: result});
    })
  })


  // Perform deposit or withdraw transactions using bank_account_id and amount
  router.post('/create-transaction',(req,res)=>{
    if(req.userInfo.isNewPassword == 1)
      return res.status(300).json({success: false, message: "User has to change password!"});

    if(!validate(req,['bank_account_number','bank_account_client_nid','type','info','amount']))
      return res.status(300).json({success: false, message: "Missing Data"});


    if(req.body.type != 'withdraw' && req.body.type != 'deposit')
      return res.status(300).json({success: false, message: "Transaction must be only withdraw or deposit"});


    var bankAccountSearchData = {};
    bankAccountSearchData['account_number'] = req.body.bank_account_number;
    var BankAccount = new data.DataModel(con, "BANK_ACCOUNT");
    BankAccount.search(bankAccountSearchData,(err, result) => {
      if(err) return res.status(300).json({success: false, message: err});

      if(result.length == 0) return res.status(300).json({success: false, message: 'Bank Account Not Found'});

      if(result[0].client_nid != req.body.bank_account_client_nid) return res.status(300).json({success: false, message: 'Bank Account Does Not Belong To Client'});

      if(parseFloat(result[0].balance) < parseFloat(req.body.amount) && req.body.type == 'withdraw')
        return res.status(300).json({success: false, message: 'Insufficient Funds!'});

      var transactionData = {};
      transactionData['bank_account_number'] = req.body.bank_account_number;
      transactionData['bank_account_client_nid'] = req.body.bank_account_client_nid;
      transactionData['account_username'] = req.userInfo.username;
      transactionData['transaction_type'] = req.body.type;
      transactionData['transaction_info'] = req.body.info;
      transactionData['transaction_amount'] = req.body.amount;

      var Transaction = new data.DataModel(con,"BANK_TRANSACTION");
      Transaction.insert(transactionData, (err, result) =>{
        if(err) return res.status(300).json({success: false, message: err});


        var op = (req.body.type == 'withdraw')? '-' : '+';
        var sql = `UPDATE BANK_ACCOUNT SET balance = balance ${op} ${req.body.amount} WHERE account_number=${req.body.bank_account_number}`
        con.query(sql,(err,update_account_result) => {
          if(err) return res.status(300).json({success: false, message: err});

        var clientInfo = {};
        clientInfo['national_id'] = req.body.bank_account_client_nid;
        var ClientObj = new data.DataModel(con, "CLIENT");
        ClientObj.search(clientInfo, (err, searchClient) => {
          if(err) return res.status(300).json({success: false, message: err});
          if(searchClient.length == 0) return res.status(300).json({success: false, message: "Can't Find Client"});

          if(searchClient[0].phone != null){
            var body = req.body.amount + " - " + req.body.type;
            var to_num = searchClient[0].phone
            var from_num = "********"

            console.log("Sending SMS");
                client.messages.create({
                  body: body,
                  to: to_num,  // Text this number
                  from: from_num // From a valid Twilio number
                })
                .then((message) => console.log(message.sid));
          }

          return res.status(200).json({success: true, message: "Operation Successful"});

        })



        })
      })
    })
  })

  router.post('/get-currencies', (req,res) => {
    if(req.userInfo.isNewPassword == 1)
      return res.status(300).json({success: false, message: "User has to change password!"});

    var Currency = new data.DataModel(con,"CURRENCY");
    Currency.search({}, (err, result) =>{
      if(err) return res.status(300).json({success: false, message: err});

      return res.status(200).json({success: true, currencies: result});
    })
  })
  // Create a bank account for a client
  router.post('/create-account',(req,res)=>{
    if(req.userInfo.isNewPassword == 1)
      return res.status(300).json({success: false, message: "User has to change password!"});

    if(!validate(req,['client_nid','account_type','currency_name']))
      return res.status(300).json({success: false, message: "Missing Data"});

    if(req.body.account_type !== 'current' && req.body.account_type !== 'savings')
      return res.status(300).json({success: false, message: "Account Type must be either current or savings"});

    var currencyData = {};
    currencyData['currency_name'] = req.body.currency_name;

    var Currency = new data.DataModel(con,"CURRENCY");
    Currency.search(currencyData,(err,result) =>{
      if(err) return res.status(300).json({success: false, message: err});
      if(result.length == 0) return res.status(300).json({success: false, message: 'Uknown Currency'});

      var clientDetails = {};
      clientDetails['national_id'] = req.body.client_nid;

      var Client = new data.DataModel(con,"CLIENT");
      Client.search(clientDetails, (err, client_result)=>{
        if(err) return res.status(300).json({success: false, message: err});
        if(client_result.length == 0) return res.status(300).json({success: false, message: 'Uknown Client'});

        var bankAccountData = {};
        bankAccountData['client_nid'] = req.body.client_nid;

        // Current is 1 while Savings is 0
        bankAccountData['account_type'] = (req.body.account_type === 'current')? 1 : 0;

        bankAccountData['currency_name'] = req.body.currency_name;
        bankAccountData['balance'] = 0;

        var BankAccount = new data.DataModel(con, "BANK_ACCOUNT");
        BankAccount.insert(bankAccountData,(err, result) =>{
          if(err) return res.status(300).json({success: false, message: err});

          return res.status(200).json({success: true, message: "Bank Account Created Successfully"});
        })
      })


    })
  })

  // Create an instance for a new client
  router.post('/create-client',(req,res)=>{
    if(req.userInfo.isNewPassword == 1)
      return res.status(300).json({success: false, message: "User has to change password!"});

    if(!validate(req,['client_name','national_id','phone','email']))
      return res.status(300).json({success: false, message: "Missing Data"});

    var clientData = extract_data(req,['client_name','national_id','phone','email']);
    var Client = new data.DataModel(con,"CLIENT");

    Client.insert(clientData, (err, result) => {
      if(err){
        err = (err.errno == 1062)? "Client Already Exists" : err;
        return res.status(300).json({success: false, message: err});
      }
      return res.status(200).json({success: true, message: 'Client Added Successfully'});
    })

  })


  return router;
}
