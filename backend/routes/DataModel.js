var model = class DataModel {

  constructor(connection,tableName){
    this.tableName = tableName;
    // this.attrs = [];
    this.con = connection;
  }

  update(data,cond,cb){

    let sql = "UPDATE " + this.tableName + " SET ";


    let objKeys = Object.keys(data);
    let length = objKeys.length;

    for (let i = 0; i < length; i++){
      sql += objKeys[i] + "='" + data[objKeys[i]] + "'";
      sql += (i < length -1)? " , " : "";
    }



    objKeys = Object.keys(cond);
    length = objKeys.length;

    sql += (length > 0)? " WHERE " : " ";

    for (let i = 0; i < length; i++){
      sql += objKeys[i] + "='" + cond[objKeys[i]] + "'";
      sql += (i < length -1)? " AND " : "";
    }

    this.con.query(sql,function(err,result){
      cb(err,result);
    })

  }
  delete(search_restrictions,cb){

        let sql = "DELETE FROM " + this.tableName;
        let objKeys = Object.keys(search_restrictions);
        let length = objKeys.length;

        sql += (length > 0)? " WHERE " : " ";

        for (let i = 0; i < length; i++){
          sql += objKeys[i] + "='" + search_restrictions[objKeys[i]] + "'";
          sql += (i < length -1)? " AND " : "";
        }


      this.con.query(sql,function(err,result){
        cb(err,result);
      })

  }
  search(search_restrictions,cb){

    let sql = "SELECT * FROM " + this.tableName;
    let objKeys = Object.keys(search_restrictions);
    let length = objKeys.length;

    sql += (length > 0)? " WHERE " : " ";

    for (let i = 0; i < length; i++){
      sql += objKeys[i] + "='" + search_restrictions[objKeys[i]] + "'";
      sql += (i < length -1)? " AND " : "";
    }


      console.log(sql);
      this.con.query(sql,function(err,result){
        cb(err,result);
      })


  }
  insert(obj,cb){

    let sql = "INSERT INTO " + this.tableName;
    let attrs = "(";
    let vals = "(";

    let objKeys = Object.keys(obj);
    let length = objKeys.length;

    for (let i = 0; i < length; i++){
      attrs += objKeys[i];
      attrs += (i < length -1)? ", " : "";

      vals += "'" + obj[objKeys[i]] + "'";
      vals += (i < length -1)? ", " : "";
    }

    attrs += ")";
    vals  += ")";

    sql += attrs + " VALUES " + vals;


    this.con.query(sql,function(err,result){
      cb(err,result);
    })

  }
}

module.exports.DataModel = model;
