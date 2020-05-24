# Config database environment variable 
export DB_CONNECTION=mongodb
export DB_HOST=localhost
export DB_PORT=27017
export DB_NAME=huychat
export DB_USERNAME=""
export DB_PASSWORD=""

# Config app environment variable
export APP_HOST=localhost
export APP_PORT=2209

#Config admin email account
export MAIL_USER=huychat.mta@gmail.com
export MAIL_PASSWORD=huychat123
export MAIL_HOST=smtp.gmail.com
export MAIL_PORT=587

#Config facebook login app
export FB_APP_ID=917958478669600
export FB_APP_SECRET=d7af2d04d3778ade0e308fa56b70ef02
export FB_CALLBACK_URL=https://localhost:2209/auth/facebook/callback
#Để khi facebook xác thực xong sẽ gọi lại URL này để trở về app