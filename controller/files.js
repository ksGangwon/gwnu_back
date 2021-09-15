import AWS from "aws-sdk";
import path from "path";
const __dirname = path.resolve();
AWS.config.loadFromPath(__dirname + "/config/s3.json");
const s3 = new AWS.S3();

export async function download(req, res) {
  console.log("테스트: ", req.params);
  const key = req.params.originalFileName;
  console.log(key);
  let params = {Bucket: "gwnu", Key: key};
  res.attachment(key);
  s3.getObject(params).createReadStream().pipe(res);
}