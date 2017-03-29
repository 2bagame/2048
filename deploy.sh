yarn build
aws s3 sync dist/. s3://2048.2bagame.com
