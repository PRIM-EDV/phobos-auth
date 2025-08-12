db = db.getSiblingDB('nest');

db.users.insertOne({
  username: "admin",
  password: "$argon2id$v=19$m=65536,t=3,p=4$rAcSfgprITJPT9XMav4NPQ$oHikR9LxszOs/o5Z/tBLd2Xr8djSyAWbbffs804cgqA",
  role: "admin"
});

db.users.insertOne({
  username: "tacop",
  password: "$argon2id$v=19$m=65536,t=3,p=4$ckFjU2ZncHJJVEpQVDlYTWF2NE5QUQ$cQSE1vKQEL97KbWLB6ZzoA",
  role: "operator"
});