class UsersController < ApplicationController
    before_action :authorize, only: [:show, :edit]
    def create
        @user = User.new(user_params)
        if @user.save
            session[:user_id] = @user.id
            redirect_to root_url, notice: "Success!"
        else
            render 'static_pages/home'
        end
    end

    def edit
    end

    def destroy
    end

    def show
        @user = User.find(params[:id])
    end

    private
        def user_params
            params.require(:user).permit(:name, :email, :password, :password_confirmation)
        end
end
