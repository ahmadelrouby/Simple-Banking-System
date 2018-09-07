const validate = require('./utils').validate_exists;
const extract_data = require('./utils').extract_info;

const config = require('./config');
const key = config.key;
const jwt = require('jsonwebtoken');
const data = require('./DataModel');

var bcrypt = require('bcrypt');

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

  router.post('/register',(req,res)=>{

    var all_keys = ['applicant_username',
                    'applicant_password',
                    'applicant_name',
                    'applicant_phone_number',
                    'applicant_email',
                    'applicant_national_id',
                    'applicant_bank_account']

    if(!validate(req,all_keys))
      return res.status(300).json({success: false, message: "Missing Data"});

    var all_data = extract_data(req,all_keys);
    cryptPassword(all_data['applicant_password'],(err, hashed_password)=>{
      if(err) throw err;

      all_data['applicant_password'] = hashed_password;
      var onlineApplication =  new data.DataModel(con,"ONLINE_APPLICATION");
      onlineApplication.insert(all_data,(err,result) =>{
        if(err) throw err;

        console.log(result);
        return res.status(200).json(result);
      })
    })
  })



  router.post('/login',(req,res)=>{

    if(!validate(req,['username','password']))
      return res.status(300).json({success: false, message: "Missing Data"});


    var all_data =  extract_data(req,['username','password']);
    var onlineAccount =  new data.DataModel(con,"ONLINE_ACCOUNT");
    var onlineAccountData = extract_data(req,['username']);
    onlineAccount.search(onlineAccountData, (err, result) => {
      if (err) throw err;

      // Incorrect Username
      if(result.length == 0) return res.status(300).json({success: false, message: "Username Not Found"});

      // Comparing Passwords
      comparePassword(all_data['password'], result[0].account_password, (err, matching_passwords) =>{
        if(err) throw err;

        // Correct Username but Incorrect Password
        if(!matching_passwords) return res.status(300).json({success: false, message: "Password is Incorrect"});


        var token = jwt.sign({username:all_data['username']},key,{expiresIn: '24h'});

        if(result[0].client_nid == null){
          // Correct Username AND Password


          return res.status(200).json({ success:true,token:token,
                                        data: {isNewPassword:result[0].isNewPassword,
                                        user_role: result[0].user_role,
                                        client_nid: result[0].client_nid,
                                        username:all_data['username']}
                                      });
        }else {

          var clientData = {};
          clientData['national_id'] = result[0].client_nid;
          var client =  new data.DataModel(con,"CLIENT");
          client.search(clientData, (err, client_result) => {
            if (err) throw err;

            return res.status(200).json({ success:true,token:token,
                                          data:{isNewPassword:result[0].isNewPassword,
                                          user_role: result[0].user_role,
                                          client_nid: result[0].client_nid,
                                          client_name: client_result[0].client_name,
                                          username:all_data['username']}
                                        });
          })
        }
      })
    })

  })

  router.post('/verify',(req,res)=>{
    if(!validate(req,['token']))
      return res.status(400).send("Missing Information");

    const token = req.body.token;
    jwt.verify(token, key, (error, decoded) =>{
      if(error){
        return res.status(300).json({success: false, message: "wrong token"});
      }

      return res.status(200).json({success: true, data: decoded});
    })

  })

  return router;
}
