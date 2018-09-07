const validate = require('./utils').validate_exists;
const extract_data = require('./utils').extract_info;


const config = require('./config');
const key = config.key;
const jwt = require('jsonwebtoken');
const data = require('./DataModel');

var _ = require('lodash') // import all methods
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '******************',
    pass: '***************'
  }
});

function sendEmail(subject, to, body, res, message){
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
        res.status(200).json({success: true, message: message})
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


  router.use((req,res,next) => {
    // VALIDATE THAT REQUEST CONTAINS AUTHORIZATION

    if(!validate(req,['token']))
      return res.status(300).json({success: false, auth_problem: true ,message: "Can't Find Token"});

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

        if(result[0].user_role != 3)
          return res.status(300).json({sucess: false, message: 'User Unauthorized to perform Admin Operations'});

        console.log("Okay Passed All the tests")
        req.userInfo = result[0];
        next()

      })
    })
  })



  router.post('/check',(req,res) =>{
    var onlineAccount =  new data.DataModel(con,"ONLINE_ACCOUNT");
    onlineAccount.search({},(err, result) =>{
      if(err) return res.status(300).json({success: false, message: err});
      return res.status(200).json({success: true, decoded_user: req.userInfo, final_result: result});
    })

    // return res.status(200).json({success: true, decoded_user: req.userInfo, body: req.body});
  })

  router.post('/create-user',(req,res)=>{

    console.log(req.userInfo);
    // if(req.userInfo.isNewPassword == 1)
    //   return res.status(300).json({success: false, message: "User has to change password!"});

    if(!validate(req,['username','account_password','user_role']))
      return res.status(300).json({success: false, message: "Missing Data"});

    var extracted_data = extract_data(req,['username','account_password','user_role']);

    if(extracted_data['user_role'] !== 'admin' && extracted_data['user_role'] !== 'teller')
      return res.status(300).json({success: false, message: "Role must be teller or admin Only!"});


    extracted_data['user_role'] = (extracted_data['user_role'] === 'admin')? "3" : "2";
    extracted_data['isNewPassword'] = (extracted_data['user_role'] === '3')? "0" : "1";

    console.log(extracted_data);
    cryptPassword(extracted_data['account_password'],(err, hashed_password) =>{
      if(err) return res.status(300).json({success: false, message: err});

      extracted_data['account_password'] = hashed_password;
      var onlineAccount =  new data.DataModel(con,"ONLINE_ACCOUNT");
      onlineAccount.insert(extracted_data,(err,result)=>{

        if(err){
          err = (err.errno == 1062)? "Username Already Exists" : err;
          return res.status(300).json({success: false, message: err});
        }

        console.log(result);
        return res.status(200).json({success: true, result: result});
      })
    })
  })


  router.post('/remove-user',(req,res)=>{

    // if(req.userInfo.isNewPassword == 1)
    //   return res.status(300).json({success: false, message: "User has to change password!"});

    if(!validate(req,['username']))
      return res.status(300).json({success: false, message: "Missing Data"});

    var user_to_remove  = new data.DataModel(con,"ONLINE_ACCOUNT");
    var user_data = extract_data(req,['username']);
    user_to_remove.search(user_data,(err,result)=>{

      if(err) return res.status(300).json({success: false, message: err});

      if(result.length == 0) return res.status(300).json({success: false, message: 'Username Not Found!'});

      if(result[0].user_role != 3 && result[0].user_role != 2)
        return res.status(300).json({success: false, message: 'User Must be an Admin or A teller Only!'});


      if(result[0].user_role == 2 && result[0].client_nid != null){

        // Change user to client only account
        var changed_data = {};

        // Change Only User Role
        changed_data['user_role'] = 1;

        // Update User Data
        user_to_remove.update(changed_data,user_data, (err, update_result) => {
          if(err) return res.status(300).json({success: false, message: err});

          return res.status(200).json({success: true, result: update_result, message: 'User changed from teller to client account!'})
        });
      }else{
        user_to_remove.delete(user_data,(err, delete_result)=>{
          if(err) return res.status(300).json({success: false, message: err});

          return res.status(200).json({success: true, result: delete_result, message: 'User deleted!'})
        })
      }
    })
  })



  router.post('/change-user-pwd',(req,res)=>{

    // if(req.userInfo.isNewPassword == 1)
    //   return res.status(300).json({success: false, message: "User has to change password!"});

    if(!validate(req,['username','account_password']))
      return res.status(300).json({success: false, message: "Missing Data"});

    var all_data = extract_data(req,['username','account_password']);
    var search_data = extract_data(req,['username']);

    var onlineAccount  = new data.DataModel(con,"ONLINE_ACCOUNT");
    onlineAccount.search(search_data,(err, result) => {
      if (err) return res.status(300).json({success: false, message: err});

      if(result.length == 0) return res.status(300).json({success: false, message: 'Username Not Found!'});

      if(result[0].user_role == 1 || result[0].client_nid != null)
        return res.status(300).json({success: false, message: 'User Must be an Admin or A teller Only!'});

      cryptPassword(all_data['account_password'], (err, hashed_password)=>{

        all_data['account_password'] = hashed_password;
        all_data['isNewPassword'] = (result[0].user_role == 3)? '0' : '1';
        onlineAccount.update(all_data,search_data,(err, update_result) =>{
          if(err) return res.status(300).json({success: false, message: err});

          return res.status(200).json({success: true, result: update_result, message: 'User Password Updated!'});
        })
      });

    })
  })



  router.post('/view-transactions',(req,res)=>{

    var bank_transactions =  new data.DataModel(con,"BANK_TRANSACTION");
    bank_transactions.search({},(err, result) =>{
      if(err) return res.status(300).json({success: false, message: err});
      return res.status(200).json({success: true, transactions: result});
    })

  })




  router.post('/view-all-applications',(req,res)=>{

    var bank_apps =  new data.DataModel(con,"ONLINE_APPLICATION");
    bank_apps.search({'application_pending' : '1'},(err, result) =>{
      if(err) return res.status(300).json({success: false, message: err});

      for(let i = 0; i < result.length; i++){
        result[i] = _.pick(result[i],'app_id','applicant_name','applicant_phone_number');
      }
      return res.status(200).json({success: true, onlineApplications: result});
    })

  })



  router.post('/view-single-application',(req,res)=>{

    if(!validate(req,['app_id']))
      return res.status(300).json({success: false, message: "Missing Data"});

    var bank_app =  new data.DataModel(con,"ONLINE_APPLICATION");
    var bank_data = extract_data(req,['app_id'])

    bank_app.search(bank_data,(err,result)=>{
      if(err) return res.status(300).json({success: false, message: err});
      if(result.length == 0) return res.status(300).json({success: false, message: 'Incorrect Application Id'});

      var returned_result = _.pick(result[0],'app_id','applicant_name',
                                            'applicant_national_id',
                                            'applicant_phone_number',
                                            'applicant_bank_account',
                                            'applicant_username',
                                            'applicant_email')

      return res.status(200).json({success: true, application: returned_result});
    })

  })


  router.post('/find-user', (req,res)=>{
    if(!validate(req,['username']))
      return res.status(300).json({success: false, message: "Missing Data"});

    var onlineAccountData = extract_data(req,['username']);
    var onlineAccount = new data.DataModel(con,'ONLINE_ACCOUNT');

    onlineAccount.search(onlineAccountData,(err, result)=>{
      if(err) return res.status(300).json({success: false, message: err});

      var toBeSentMessage = (result.length == 0)? "User does Not exist" : "User exists";
      return res.status(200).json({success: true, message: toBeSentMessage});

    })

  })


  router.post('/is-teller', (req,res) => {

    if(!validate(req,['username']))
      return res.status(300).json({success: false, message: "Missing Data"});

    var userData = extract_data(req,['username'])
    var onlineAccount = new data.DataModel(con,'ONLINE_ACCOUNT');
    onlineAccount.search(userData, (err, result) => {
      if(err) return res.status(300).json({success: false, message: err});
      if(result.length == 0) return res.status(200).json({success: true, tellerInfo: {isTeller: false}});
      if(result[0].user_role != 2) return res.status(200).json({success: true, tellerInfo: {isTeller: false}});

      return res.status(200).json({success: true, tellerInfo: {isTeller: true}});
    })

  })


  router.post('/compare-application', (req,res) =>{

    if(!validate(req,['client_id']))
      return res.status(300).json({success: false, message: "Missing Data"});

    var nid = req.body.client_id;
    var sql_query = `SELECT * FROM BANK_ACCOUNT acc, CLIENT c WHERE acc.client_nid = c.national_id AND acc.client_nid = '${nid}'`
    con.query(sql_query, (err, result) => {
      if(err) return res.status(300).json({success: false, message: err});
      return res.status(200).json({success:true, accounts: result});
    })

  })


  router.post('/approve-application',(req,res)=>{

    if(!validate(req,['app_id']))
      return res.status(300).json({success: false, message: "Missing Data"});

    var bank_app =  new data.DataModel(con,"ONLINE_APPLICATION");
    var bank_data = extract_data(req,['app_id'])

    bank_app.search(bank_data,(err,bank_app_result)=>{
      if(err) return res.status(300).json({success: false, message: err});
      if(bank_app_result.length == 0) return res.status(300).json({success: false, message: 'Incorrect Application Id'});
      if(bank_app_result[0].application_pending != 1) return res.status(300).json({success: false, message: 'Application has already been processed'});

      var onlineAccount = new data.DataModel(con,'ONLINE_ACCOUNT');
      var onlineAccountData = {};
      onlineAccountData['username'] = bank_app_result[0].applicant_username;
      onlineAccount.search(onlineAccountData,(err,online_account_result)=>{
        if(err) return res.status(300).json({success: false, message: err});

        if(online_account_result.length == 0){
          // Username doesn't exist just add

          var onlineAccountData = {};
          onlineAccountData['username'] = bank_app_result[0].applicant_username;
          onlineAccountData['account_password'] = bank_app_result[0].applicant_password;
          onlineAccountData['isNewPassword'] = "0";
          onlineAccountData['user_role'] = "1";
          onlineAccountData['client_nid'] = bank_app_result[0].applicant_national_id;

          onlineAccount.insert(onlineAccountData,(err, insertion_result)=>{
            if(err) return res.status(300).json({success: false, message: err});

            var bank_update_data = {};
            bank_update_data['application_pending'] = 2;

            bank_app.update(bank_update_data,bank_data,(err, result) =>{
              if(err) return res.status(300).json({success: false, message: err});


              var to = {
                name: bank_app_result[0].applicant_name,
                email: bank_app_result[0].applicant_email
              };
              var subject = "Application Approved!";
              var body = `Your Client account is now activated, you may proceed by logging in with the password you have chosen!`;

              sendEmail(subject, to, body, res, "Application Approved");

              // Send an email to user to be approved
              // return res.status(200).json({success: true, message: "Application Approved", result: insertion_result});
            })
          })

        }else{
          // Username Exists => Check if Admin, otherwise just add as client

          // If Username exists
          // Send an email to applicant asking to apply again with another username
          if(online_account_result[0].user_role != 2) return res.status(300).json({success: false, message: "Username Already Exists"});

          // Else if the user was a teller, just add as client
          var onlineAccountData = {};
          onlineAccountData['username'] = bank_app_result[0].applicant_username;
          onlineAccountData['account_password'] = bank_app_result[0].applicant_password;
          onlineAccountData['isNewPassword'] = "0";

          onlineAccountData['client_nid'] = bank_app_result[0].applicant_national_id;

          var onlineAccountSearch = {};
          onlineAccountSearch['username'] = bank_app_result[0].applicant_username;

          onlineAccount.update(onlineAccountData,onlineAccountSearch,(err,updating_result)=>{
            if(err) return res.status(300).json({success: false, message: err});

            var bank_update_data = {};
            bank_update_data['application_pending'] = 2;

            bank_app.update(bank_update_data,bank_data,(err, result) =>{
              if(err) return res.status(300).json({success: false, message: err});



              var to = {
                name: bank_app_result[0].applicant_name,
                email: bank_app_result[0].applicant_email
              };
              var subject = "Application Approved!";
              var body = `Your Client account is now activated, you may proceed by logging in with the password you have chosen!`;

              sendEmail(subject, to, body, res, "Client Account is now linked to teller account");

              // Send an email to user to be approved
              // return res.status(200).json({success: true, message: "Client Account is now linked to teller account", result: updating_result});

            })
          })
        }
        })
      })
    })

  return router;
}
