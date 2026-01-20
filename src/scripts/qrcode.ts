import QRCode from "qrcode";

const otpAuthUrl = process.argv[2];

if (!otpAuthUrl) {
  throw new Error("pass otpAuthurl as agrument !");
}

const main = async () => {
  await QRCode.toFile("totp.png", otpAuthUrl);
  console.log("Saved Url");
};

main().catch((error) => {
  console.log(error);
  process.exit(1);
});

//npx ts-node qrcode.ts "otpauth://totp/MyService:user@email.com?secret=XXXX&issuer=MyService"

