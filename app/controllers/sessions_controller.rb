class SessionsController < ApplicationController
    def create
        user = User.find_by(email: params[:session][:email].downcase)
        if user && user.authenticate(params[:session][:password])
            sign_in user
            redirect_to root_url, notice: "Logged in!"
        else
            #flash.now.alert = "Email and password is invalid"
            redirect_to root_url, notice: "Email and password is invalid!"
        end
    end

    def destroy
        session[:user_id] = nil
        redirect_to root_url, notice: "Logged Out"
    end
end
