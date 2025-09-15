import AWS from "aws-sdk";

// SOLcation S3 설정
const config = {
  aws_reg: process.env.REACT_APP_AWS_REGION || "ap-northeast-2",
  aws_key: process.env.REACT_APP_AWS_ACCESS_KEY_ID || "",
  aws_sec: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY || "",
  bucket_name: process.env.REACT_APP_S3_BUCKET_NAME || "solcation",
};

AWS.config.update({
  region: config.aws_reg,
  accessKeyId: config.aws_key,
  secretAccessKey: config.aws_sec,
});

const s3 = new AWS.S3();

// 그룹 프로필 이미지 가져오기
const getGroupProfileImage = async (imagePath) => {
  if (!imagePath) return null;

  try {
    const data = await s3
      .getObject({
        Key: `images/group_profiles/${imagePath}`,
        Bucket: config.bucket_name,
      })
      .promise();

    const blob = new Blob([data.Body], { type: "image/jpeg" });
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(blob);

    return imageUrl;
  } catch (error) {
    console.error('그룹 프로필 이미지 로드 실패:', error);
    return null;
  }
};

// 여행 프로필 이미지 가져오기
const getTravelProfileImage = async (imagePath) => {
  if (!imagePath) return null;

  try {
    const data = await s3
      .getObject({
        Key: `images/travel_profiles/${imagePath}`,
        Bucket: config.bucket_name,
      })
      .promise();

    const blob = new Blob([data.Body], { type: "image/jpeg" });
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(blob);

    return imageUrl;
  } catch (error) {
    console.error('여행 프로필 이미지 로드 실패:', error);
    return null;
  }
};

// 서명 이미지 가져오기
const getSignatureImage = async (imagePath) => {
  if (!imagePath) return null;

  try {
    const data = await s3
      .getObject({
        Key: `signatures/${imagePath}`,
        Bucket: config.bucket_name,
      })
      .promise();

    const blob = new Blob([data.Body], { type: "image/png" });
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(blob);

    return imageUrl;
  } catch (error) {
    console.error('서명 이미지 로드 실패:', error);
    return null;
  }
};

const uploadImage = async (file, type = 'group') => {
  if (!file) return null;

  const fileExtension = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
  
  let key;
  switch (type) {
    case 'group':
      key = `images/group_profiles/${fileName}`;
      break;
    case 'travel':
      key = `images/travel_profiles/${fileName}`;
      break;
    case 'signature':
      key = `signatures/${fileName}`;
      break;
    default:
      key = `images/group_profiles/${fileName}`;
  }

  try {
    const params = {
      Bucket: config.bucket_name,
      Key: key,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read' 
    };

    const result = await s3.upload(params).promise();
    return result.Location; 
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    return null;
  }
};
export { 
  getGroupProfileImage, 
  getTravelProfileImage, 
  getSignatureImage,
  uploadImage,
};