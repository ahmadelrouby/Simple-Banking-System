

module.exports.validate_exists = (req,arr) => {

  for(el in arr){
    if(!req.body[arr[el]])
      return false;
  }

  return true;
}


module.exports.extract_info = (req,arr) => {

  var to_return = {};
  for (el in arr){
    to_return[arr[el]] = req.body[arr[el]].toString().trim();
  }

  return to_return;

}
